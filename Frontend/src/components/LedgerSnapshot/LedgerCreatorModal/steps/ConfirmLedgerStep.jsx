import React, { useMemo } from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { format } from 'date-fns';

const SummaryRow = ({ label, value, isNote = false }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', py: 1.5, gap: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>{label}</Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 'medium',
            textAlign: 'right',
            // These styles will fix the overflow for any long text
            whiteSpace: isNote ? 'pre-wrap' : 'normal',
            wordBreak: 'break-word',
          }}
        >
          {value}
        </Typography>
    </Box>
);

export const ConfirmLedgerStep = ({ formData }) => {
  const { title, contactLabel } = useMemo(() => {
    switch (formData.type) {
      case 'Given': return { title: 'Confirm Payment Given', contactLabel: 'Recipient' };
      case 'Received': return { title: 'Confirm Payment Received', contactLabel: 'Sender' };
      default: return { title: 'Confirm Entry', contactLabel: 'Contact' };
    }
  }, [formData.type]);

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: 'bold' }}>{title}</Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        Please review the details before saving.
      </Typography>
      <Stack divider={<Divider />} sx={{ mt: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 2, width: '100%', maxWidth: 350 }}>
        <SummaryRow label="Type" value={formData.type} />
        <SummaryRow label={contactLabel} value={formData.contact?.name} />
        <SummaryRow label="Amount" value={`₹${parseFloat(formData.amount || 0).toFixed(2)}`} />
        <SummaryRow label="Date" value={format(formData.date, "MMMM do, yyyy")} />
        {formData.notes && <SummaryRow label="Notes" value={formData.notes} />}
      </Stack>
    </Box>
  );
};