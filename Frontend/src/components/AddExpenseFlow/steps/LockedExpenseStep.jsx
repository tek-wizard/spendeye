import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const LockedExpenseStep = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', p: 2, gap: 2, color: 'text.secondary' }}>
    <InfoOutlinedIcon sx={{ fontSize: 40 }} />
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Editing Locked</Typography>
    <Typography variant="body2">
      This expense was created automatically from a ledger entry. To maintain data integrity, it cannot be edited here.
    </Typography>
  </Box>
);

export default LockedExpenseStep