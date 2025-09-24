import React from 'react';
import { Box, Typography, Avatar, IconButton, ButtonBase } from '@mui/material';

export const MobileHeader = ({ onTitleClick, onAvatarClick }) => {
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
        <Avatar alt="User" />
      </IconButton>
    </Box>
  );
};

export default MobileHeader;