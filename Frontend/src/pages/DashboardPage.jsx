// src/pages/DashboardPage.jsx
import React, { useMemo, useState } from "react";
import { Box, Chip } from "@mui/material";
import { getDaysInMonth } from "date-fns";

// Hooks
import { useExpenses } from "../hooks/useExpenses";
import { useDashboardSummary } from "../hooks/useDashboardSummary";

// Component Containers
import { MonthlySummaryContainer } from "../components/MonthlySummary";
import LedgerSnapshot from '../components/LedgerSnapshot/LedgerSnapshot';
import { SpendingChartContainer } from "../components/SpendingChart";
import { RecentTransactions } from '../components/RecentTransactions';
import { AddExpenseFlow } from "../components/AddExpenseFlow/AddExpenseFlow";

const DashboardPage = () => {
  // --- DATA FETCHING ---
  const { rawExpenses, isLoading: isExpensesLoading } = useExpenses();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();

  const [categoryFilter, setCategoryFilter] = useState(null);

  // --- DATA PROCESSING ---
  const adaptedSummaryData = useMemo(() => {
    if (isSummaryLoading || !summary) {
      return { summaryCardData: null, spendingData: [], totalSpending: 0 };
    }

    const dailyTotalsFromAPI = (summary.sparklineData || []).reduce((acc, item) => {
      const dayOfMonth = new Date(item.day).getUTCDate();
      acc[dayOfMonth] = item.total;
      return acc;
    }, {});
    
    const daysInCurrentMonth = getDaysInMonth(new Date());

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
  }, [summary, isSummaryLoading]);

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
  );
};

export default DashboardPage;