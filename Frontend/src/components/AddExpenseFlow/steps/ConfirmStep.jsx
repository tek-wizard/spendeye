// src/components/AddExpenseFlow/steps/ConfirmStep.jsx

import { useMemo , useRef, useEffect} from 'react';
import { Box, Typography, Button, Card, CardContent, Avatar, Stack, Divider,CircularProgress } from '@mui/material';
import { format } from 'date-fns';

// Icons
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import NotesOutlinedIcon from '@mui/icons-material/NotesOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import { useTheme } from '@mui/material/styles';

// Helper component for a consistent layout
const DetailRow = ({ icon, label, value, isNote = false }) => (
  <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ py: 1.5 }}>
    {icon}
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          fontWeight: 'medium',
          whiteSpace: isNote ? 'pre-wrap' : 'normal',
          wordBreak: isNote ? 'break-word' : 'normal',
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
);

export const ConfirmStep = ({ formData, onSubmit, isCreating, isEditMode }) => {
  const theme = useTheme();
  const submitButtonRef = useRef(null);

  // This effect will run once when the component mounts, focusing the button
  useEffect(() => {
    setTimeout(() => submitButtonRef.current?.focus(), 150);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (onEnterPress) {
        onEnterPress();
      }
    }
  };

  // Data Transformation logic remains the same
  const getCategoryDisplay = (category) => {
    if (!category) return 'N/A';
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const participants = useMemo(() => {
    if (!formData.isShared || !formData.splits) return [];
    const you = {
      ...{ id: 'user', name: 'You' },
      amount: (formData.splits.find(s => s.participantId === 'user')?.amount || 0).toFixed(2)
    };
    const others = formData.contacts.map(contact => ({
      ...contact,
      amount: (formData.splits.find(s => s.participantId === contact._id)?.amount || 0).toFixed(2)
    }));
    return [you, ...others];
  }, [formData.isShared, formData.contacts, formData.splits]);

  const iconColor = theme.palette.secondary.main;

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Confirm Expense</Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        Please review the details before creating the expense.
      </Typography>

      <Card sx={{ width: '100%', maxWidth: 400, mt: 2, bgcolor: theme.palette.background.paper }}>
        <CardContent>
          <Stack spacing={0} divider={<Divider flexItem />}>
            <DetailRow 
              icon={<CurrencyRupeeIcon sx={{ color: iconColor, mt: '4px' }} />}
              label="Total Amount"
              value={`₹${parseFloat(formData.amount || 0).toFixed(2)}`}
            />
            <DetailRow 
              icon={<LocalOfferOutlinedIcon sx={{ color: iconColor, mt: '4px' }} />}
              label="Category"
              value={getCategoryDisplay(formData.category)}
            />
            <DetailRow 
              icon={<CalendarTodayOutlinedIcon sx={{ color: iconColor, mt: '4px' }} />}
              label="Date"
              value={format(formData.date, 'PPP')}
            />
            {formData.notes && (
              <DetailRow 
                icon={<NotesOutlinedIcon sx={{ color: iconColor, mt: '4px' }} />}
                label="Notes"
                value={formData.notes}
                isNote={true}
              />
            )}
            {/* The "Split Between" section now correctly checks for participants */}
            {participants.length > 1 && (
              <Stack direction="row" spacing={2} sx={{ py: 1.5, alignItems: 'flex-start' }}>
                <GroupOutlinedIcon color="secondary" sx={{ mt: '4px' }} />
                <Box sx={{ width: '100%', overflow: 'hidden' }}>
                  <Typography variant="caption" color="text.secondary">Split Between</Typography>
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', py: 1, pr: '16px', '&::-webkit-scrollbar': { height: '4px' }, '&::-webkit-scrollbar-thumb': { bgcolor: 'divider', borderRadius: '2px' } }}>
                    {participants.map(p => (
                      <Stack key={p.id} alignItems="center" spacing={0.5} sx={{ minWidth: 70, flexShrink: 0 }}>
                        <Avatar sx={{ 
                          width: 40, height: 40,
                          bgcolor: p.id === 'user' ? 'primary.main' : 'accent.main', 
                          color: p.id === 'user' ? 'primary.contrastText' : 'accent.contrastText' 
                        }}>
                          {p.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography noWrap variant="caption" title={p.name} sx={{ width: '100%', textAlign: 'center' }}>
                          {p.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                          ₹{p.amount}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </Box>
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
      
      <Button 
        ref={submitButtonRef}
        type="submit"
        variant="contained" 
        size="large"
        fullWidth 
        sx={{ mt: 3, maxWidth:400 }}
        disabled={isCreating}
      >
      {isCreating ? <CircularProgress size={24} color="inherit" /> : isEditMode ? 'Save Changes' : 'Create Expense'}
    </Button>
    </Box>
  );
};

export default ConfirmStep