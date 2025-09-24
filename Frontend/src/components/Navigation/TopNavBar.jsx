import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, useTheme, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

const navLinks = ['Home', 'Expenses', 'Ledger', 'Insights'];

// The component now receives onAvatarClick as a prop
export const TopNavBar = ({ onAvatarClick }) => {
  const theme = useTheme();
  const [activePage, setActivePage] = useState('Home');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => { setScrolled(window.scrollY > 10); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppBar position="fixed" elevation={0} sx={{
        backgroundColor: scrolled ? theme.palette.background.paper + 'cc' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid',
        borderColor: scrolled ? theme.palette.divider : 'transparent',
        transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
        display: { xs: 'none', md: 'flex' },
      }}
    >
      <Toolbar className="max-w-7xl mx-auto w-full">
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Spendy</Typography>
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          {navLinks.map((page) => (
            <Button key={page} onClick={() => setActivePage(page)} sx={{ color: 'text.primary', position: 'relative', py: 2, height: '100%' }}>
              {page}
              {activePage === page && (
                <motion.div layoutId="active-underline" style={{ position: 'absolute', bottom: 0, left: '16px', right: '16px', height: '3px', background: theme.palette.primary.main, borderRadius: '2px' }}/>
              )}
            </Button>
          ))}
        </Box>
        <Tooltip title="Account Settings">
          {/* The onClick now uses the function passed down from the parent */}
          <IconButton onClick={onAvatarClick} sx={{ p: 0 }}>
            <Avatar alt="User" />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavBar;