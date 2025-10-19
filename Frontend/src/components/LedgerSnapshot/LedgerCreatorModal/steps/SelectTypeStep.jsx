import React from 'react';
import { Box, Typography, Stack, ToggleButtonGroup, ToggleButton, useTheme } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export const SelectTypeStep = ({ onSelect }) => {
    const theme = useTheme();

    const types = [
      { 
        value: 'Given', 
        label: 'Money Given', 
        description: 'You paid someone or lent them money.', 
        Icon: ArrowUpwardIcon,
        color: theme.palette.error.main
      },
      { 
        value: 'Received', 
        label: 'Money Received', 
        description: 'You received a payment or borrowed money.', 
        Icon: ArrowDownwardIcon,
        color: theme.palette.success.main
      },
    ];

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>New Ledger Entry</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                What kind of transaction is this?
            </Typography>

            <ToggleButtonGroup
                orientation="vertical"
                exclusive
                fullWidth
                sx={{ maxWidth: 350, gap: 1 }}
                onChange={(e, newValue) => { if (newValue) onSelect(newValue); }}
            >
                {types.map(type => (
                    <ToggleButton
                        key={type.value}
                        value={type.value}
                        sx={{ 
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            p: 2,
                            borderRadius: '12px !important', // Enforce consistent border radius
                            border: `1px solid ${theme.palette.divider} !important`,
                            textTransform: 'none',
                            lineHeight: 1.4,
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '& .MuiTypography-colorTextSecondary': { // Target the description text
                                    color: 'primary.contrastText',
                                    opacity: 0.7
                                }
                            }
                        }}
                    >
                        <type.Icon sx={{ mr: 2, color: type.color }} />
                        <Box>
                            <Typography sx={{ fontWeight: 'medium' }}>{type.label}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal' }}>
                                {type.description}
                            </Typography>
                        </Box>
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
        </Box>
    );
};