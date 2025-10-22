import React from 'react';
import { Box, Typography, Avatar, IconButton, ButtonBase } from '@mui/material';
import { motion } from 'framer-motion';

export const MobileHeader = ({ onTitleClick, onAvatarClick, isSettingsPage }) => {
  return (
    <Box 
      sx={{ 
        display: { xs: 'flex', md: 'none' },
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
      }}
    >
      <ButtonBase onClick={onTitleClick} sx={{ borderRadius: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', px: 1 }}>
          Spendy
        </Typography>
      </ButtonBase>
      <IconButton onClick={onAvatarClick} sx={{ p: 0 }}>
        <motion.div
          animate={{ rotate: isSettingsPage ? -25 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 40 }}
        >
          <Avatar alt="User" />
        </motion.div>
      </IconButton>
    </Box>
  );
};

export default MobileHeader;