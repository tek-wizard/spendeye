// src/components/FloatingActionButton.jsx
import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const FloatingActionButton = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 80, // Position above the BottomNavBar
        right: 16,
        display: { xs: 'block', md: 'none' },
      }}
    >
      <Fab sx={{ backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: '#e0e0e0' } }} aria-label="add">
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default FloatingActionButton;