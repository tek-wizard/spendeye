import { Box, Typography } from '@mui/material';

const ExpensesPage = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Expenses</Typography>
      <Typography color="text.secondary">This is where the detailed expenses list, filtering, and management will live.</Typography>
    </Box>
  );
};
export default ExpensesPage;