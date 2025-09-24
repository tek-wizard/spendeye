import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { format } from 'date-fns';

// A simple reusable row for the summary
// A simple reusable row for the summary
const SummaryRow = ({ label, value, isNote = false }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1, gap: 2 }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 'medium',
            textAlign: 'right',
            // FIX: Ensure notes wrap correctly
            whiteSpace: isNote ? 'pre-wrap' : 'normal',
            wordBreak: isNote ? 'break-word' : 'normal',
          }}
        >
          {value}
        </Typography>
    </Box>
);

export const ConfirmIOUStep = ({ formData }) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>Confirm New IOU</Typography>
      <Stack divider={<Divider />} sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 2, width: '100%', maxWidth: 350 }}>
        <SummaryRow label="Amount" value={`₹${parseFloat(formData.amount || 0).toFixed(2)}`} />
        <SummaryRow label="Lender" value={formData.contact?.name} />
        <SummaryRow label="Phone" value={formData.contact?.phone} />
        <SummaryRow label="Type" value="Borrowed" />
        <SummaryRow label="Date" value={format(formData.date, "MMMM do, yyyy")} />
        {formData.notes && <SummaryRow label="Notes" value={formData.notes} isNote={true} />}
      </Stack>
    </Box>
  );
};