// src/pages/MainLayout.jsx
import React, { useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Box, Menu, MenuItem, Divider, ListItemIcon, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Component Imports
import { TopNavBar, BottomNavBar, MobileHeader } from '../components/Navigation';

// Icon Imports
import Settings from '@mui/icons-material/Settings';
import PersonOutline from '@mui/icons-material/PersonOutline';
import Logout from '@mui/icons-material/Logout';

const navTabs = ['home', 'expenses', 'ledger', 'insights'];

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // --- USER MENU STATE ---
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // --- NAVIGATION STATE & HANDLERS ---
  const activeTab = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/expenses')) return 'expenses';
    if (path.startsWith('/ledger')) return 'ledger';
    if (path.startsWith('/insights')) return 'insights';
    return 'home';
  }, [location.pathname]);

  const handleNavigate = (path) => {
    navigate(path);
  };
  
  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <Box className="bg-black min-h-screen text-gray-50">
      <TopNavBar activeTab={activeTab} onNavigate={handleNavigate} onAvatarClick={handleMenuOpen} />
      <MobileHeader onAvatarClick={handleMenuOpen} onTitleClick={handleTitleClick} />

      {/* THE FIX: Changed <motion.main> back to a simple <main> element */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pt-24 md:pb-8">
        <Outlet />
      </main>
      
      <BottomNavBar activeTab={activeTab} onTabChange={(tab) => handleNavigate(`/${tab === 'home' ? '' : tab}`)} />

      {/* User Profile Menu */}
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
    </Box>
  );
};

export default MainLayout;