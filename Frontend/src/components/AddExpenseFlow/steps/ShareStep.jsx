import { Button, Box, Typography, Tooltip } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';

export const ShareStep = ({ formData, onSelect }) => {
  // The categories that cannot be split
  const nonSplittableCategories = ["Debt Repayment", "Loan Given"];
  
  // Checking if the current category from the form data is one of them
  const isNonSplittable = nonSplittableCategories.includes(formData.category);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
        Shared Expense?
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Is this expense shared with others?
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', maxWidth: '300px' }}>
        <Tooltip 
          title={isNonSplittable ? "Expenses in this category cannot be split." : ""} 
          arrow
          placement="top" 
        >
          <Box>
            <Button
              variant={formData.isShared === true ? 'contained' : 'outlined'}
              size="large"
              onClick={() => onSelect(true)}
              startIcon={<GroupIcon />}
              disabled={isNonSplittable}
              fullWidth
            >
              Yes, it's shared
            </Button>
          </Box>
        </Tooltip>

        <Button
          variant={formData.isShared === false ? 'contained' : 'outlined'}
          size="large"
          onClick={() => onSelect(false)}
          startIcon={<PersonIcon />}
        >
          No, just me
        </Button>
      </Box>
    </Box>
  );
};

export default ShareStep