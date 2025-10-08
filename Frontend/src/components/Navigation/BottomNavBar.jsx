// src/components/Navigation/BottomNavBar.jsx
import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, useTheme } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import InsightsIcon from '@mui/icons-material/Insights';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const navItems = [
  { id: 'home', label: 'Home', outlined: <HomeOutlinedIcon />, filled: <HomeIcon /> },
  { id: 'expenses', label: 'Expenses', outlined: <ReceiptLongOutlinedIcon />, filled: <ReceiptLongIcon /> },
  { id: 'ledger', label: 'Ledger', outlined: <AccountBalanceWalletOutlinedIcon />, filled: <AccountBalanceWalletIcon /> },
  { id: 'insights', label: 'Insights', outlined: <InsightsOutlinedIcon />, filled: <InsightsIcon /> },
];

export const BottomNavBar = ({ activeTab, onTabChange }) => {
  const theme = useTheme();

  const handleTabChangeWithHaptics = (event, newValue) => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onTabChange(newValue); // Calls the navigation function from MainLayout
  };

  return (
    <Paper
      sx={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        display: { xs: 'block', md: 'none' },
        background: theme.palette.background.paper + 'cc',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid',
        borderColor: theme.palette.divider,
        zIndex:10
      }}
      elevation={3}
    >
      <BottomNavigation
        value={activeTab} // Fully controlled by the prop from MainLayout
        onChange={handleTabChangeWithHaptics}
        sx={{ backgroundColor: 'transparent', height: 64 }}
      >
        {navItems.map((item) => (
          <BottomNavigationAction
            key={item.id}
            label={item.label}
            value={item.id}
            icon={activeTab === item.id ? item.filled : item.outlined}
            sx={{
              color: activeTab === item.id ? 'primary.main' : 'text.secondary',
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main + '14',
                borderRadius: 4,
              },
              minWidth: 0,
              padding: '0 8px',
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;