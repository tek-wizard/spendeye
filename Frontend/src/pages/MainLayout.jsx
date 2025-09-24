// src/pages/MainLayout.jsx
import React, { useMemo } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { TopNavBar, BottomNavBar, MobileHeader } from '../components/Navigation';
import { Box } from '@mui/material';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // This logic derives the active tab from the current URL path.
  // The router is now the single source of truth.
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/expenses')) return 'expenses';
    if (path.startsWith('/ledger')) return 'ledger';
    if (path.startsWith('/insights')) return 'insights';
    return 'home'; // Default to 'home' for the root path "/"
  }, [location.pathname]);

  // This function will be passed to the navigation components.
  const handleNavigate = (path) => {
    navigate(path);
  };
  
  return (
    <Box className="bg-black min-h-screen text-gray-50">
      <TopNavBar activeTab={activeTab} onNavigate={handleNavigate} />
      <MobileHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pt-24 md:pb-8">
        <Outlet /> {/* Child pages (Dashboard, Expenses, etc.) render here */}
      </main>
      
      <BottomNavBar activeTab={activeTab} onTabChange={(tab) => handleNavigate(`/${tab === 'home' ? '' : tab}`)} />
    </Box>
  );
};

export default MainLayout;