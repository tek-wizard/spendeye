import React, { useMemo, useState } from "react";
import { Box, Typography, Divider, ListItemIcon, Grid, Skeleton, Menu, MenuItem, Chip } from "@mui/material";
import { motion } from 'framer-motion';
import { getDaysInMonth } from "date-fns";

// Hooks
import { useExpenses } from "../hooks/useExpenses";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

// Component Containers
import { TopNavBar, BottomNavBar, MobileHeader } from "../components/Navigation";
import { MonthlySummaryContainer } from "../components/MonthlySummary";
import LedgerSnapshot from '../components/LedgerSnapshot/LedgerSnapshot';
import { SpendingChartContainer } from "../components/SpendingChart";
import { RecentTransactions } from '../components/RecentTransactions';
import { AddExpenseFlow } from "../components/AddExpenseFlow/AddExpenseFlow";

// Icons
import Settings from '@mui/icons-material/Settings';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Logout from '@mui/icons-material/Logout';

const navTabs = ['home', 'expenses', 'ledger', 'insights'];

const DashboardPage = () => {
  // --- DATA FETCHING ---
  const { rawExpenses, isLoading: isExpensesLoading } = useExpenses();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();

  const [categoryFilter, setCategoryFilter] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // --- HANDLERS ---
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleTitleClick = () => { window.location.reload(); };
  const handleSwipe = (event, info) => {
    const swipeThreshold = 50;
    const swipeVelocity = 0.3;
    const currentIndex = navTabs.indexOf(activeTab);
    
    if (info.offset.x > swipeThreshold && info.velocity.x > swipeVelocity) {
      if (currentIndex > 0) setActiveTab(navTabs[currentIndex - 1]);
    } else if (info.offset.x < -swipeThreshold && info.velocity.x < -swipeVelocity) {
      if (currentIndex < navTabs.length - 1) setActiveTab(navTabs[currentIndex + 1]);
    }
  };

  // --- DATA PROCESSING ---
  // This memo adapts the data from your new summary API to fit our components
  const adaptedSummaryData = useMemo(() => {
    if (isSummaryLoading || !summary) {
      return { summaryCardData: null, spendingData: [], totalSpending: 0 };
    }

    // --- NEW LOGIC FOR SPARKLINE ---
    // 1. Create a quick-lookup map of daily totals from the API response
    const dailyTotalsFromAPI = (summary.sparklineData || []).reduce((acc, item) => {
      // The backend sends a full date string like "2025-09-18"
      const dayOfMonth = new Date(item.day).getUTCDate(); // Use getUTCDate() to avoid timezone shifts
      acc[dayOfMonth] = item.total;
      return acc;
    }, {});
    
    // 2. Get the total number of days for the current month
    const daysInCurrentMonth = getDaysInMonth(new Date());

    // 3. Create a full array for the month, filling in gaps with 0
    const finalSparklineData = Array.from({ length: daysInCurrentMonth }, (_, i) => {
      const dayOfMonth = i + 1;
      return {
        day: dayOfMonth,
        amount: dailyTotalsFromAPI[dayOfMonth] || 0,
      };
    });

    const summaryCardData = {
      currentSpending: summary.summaryCard.total,
      budget: summary.summaryCard.budget,
      trendPercentage: summary.summaryCard.trendPercentage,
      sparklineData: finalSparklineData,
    };
    
    const spendingData = summary.spendingChartData.map(item => ({
        name: item.category,
        value: item.total,
    }));

    return { summaryCardData, spendingData, totalSpending: summary.summaryCard.total };
  }, [summary,isSummaryLoading]);

  // This memo processes the raw list for the RecentTransactions component
  const filteredMonthExpenses = useMemo(() => {
    if (!rawExpenses || rawExpenses.length === 0) return [];
    const now = new Date();
    const currentMonthExpenses = rawExpenses.filter(
      (e) => new Date(e.date).getMonth() === now.getMonth()
    );
    if (!categoryFilter) return currentMonthExpenses;
    return currentMonthExpenses.filter(e => e.category === categoryFilter);
  }, [rawExpenses, categoryFilter]);

  return (
    <div className="bg-black min-h-screen text-gray-50">
      <TopNavBar onAvatarClick={handleMenuOpen} />
      <MobileHeader onAvatarClick={handleMenuOpen} onTitleClick={handleTitleClick} />

      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pt-24 md:pb-8"
        onPanEnd={handleSwipe}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-8">
            <MonthlySummaryContainer
              summaryData={adaptedSummaryData.summaryCardData}
              isLoading={isSummaryLoading}
            />
            <LedgerSnapshot />
            <SpendingChartContainer
                spendingData={adaptedSummaryData.spendingData}
                totalSpending={adaptedSummaryData.totalSpending}
                isLoading={isSummaryLoading}
                onCategoryClick={setCategoryFilter}
            />
          </div>

          {/* Right Column */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-8">
            <AddExpenseFlow />
            {categoryFilter && (
              <Box>
                <Chip
                  label={`Filtered by: ${categoryFilter}`}
                  onDelete={() => setCategoryFilter(null)}
                  color="primary"
                  sx={{ bgcolor: "accent.main", color: "accent.contrastText", fontWeight: "medium" }}
                />
              </Box>
            )}
            <RecentTransactions 
              expenses={filteredMonthExpenses}
              isLoading={isExpensesLoading}
            />
          </div>
        </div>
      </motion.main>
      <BottomNavBar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
       <Menu
        anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose} onClick={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5, bgcolor: 'background.paper',
            '&::before': {
              content: '""', display: 'block', position: 'absolute',
              top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem disabled>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="body1" color="primary" sx={{ fontWeight: 'bold' }}>Prateek Singh</Typography>
            <Typography variant="caption" color="text.secondary">prateek@example.com</Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem><ListItemIcon><PersonOutline fontSize="small" /></ListItemIcon>Profile</MenuItem>
        <MenuItem><ListItemIcon><Settings fontSize="small" /></ListItemIcon>Settings</MenuItem>
        <Divider />
        <MenuItem sx={{ color: 'error.main' }}><ListItemIcon><Logout fontSize="small" sx={{ color: 'error.main' }} /></ListItemIcon>Logout</MenuItem>
      </Menu>
    </div>
  );
};

export default DashboardPage;