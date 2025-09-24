import { Box, Typography } from '@mui/material';

const LedgerPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Ledger</Typography>
      <Typography color="text.secondary">This page will contain the full history of your ledger, allowing you to view and manage all IOU transactions.</Typography>
    </Box>
  );
};
export default LedgerPage;