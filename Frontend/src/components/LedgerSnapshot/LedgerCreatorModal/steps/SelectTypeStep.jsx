import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useTheme } from '@mui/material/styles';

export const SelectTypeStep = ({ onSelect }) => {
    const theme = useTheme();

    // We define the types here, separating the icon from the color
    const types = [
      { 
        value: 'Given', 
        label: 'Money Given', 
        description: 'Money left your possession (e.g., a loan or paying someone back).', 
        Icon: ArrowUpwardIcon,
        color: theme.palette.error.main
      },
      { 
        value: 'Received', 
        label: 'Money Received', 
        description: 'Money entered your possession (e.g., borrowing or getting paid back).', 
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
            <Stack spacing={2} sx={{ width: '100%', maxWidth: 350 }}>
                {types.map(type => (
                    <Button
                        key={type.value}
                        onClick={() => onSelect(type.value)}
                        variant="contained" // Use contained for a card-like feel
                        size="large"
                        sx={{ 
                            justifyContent: 'flex-start', 
                            p: 2, 
                            textAlign: 'left', 
                            textTransform: 'none',
                            lineHeight: 1.4,
                            bgcolor: 'background.paper', // A neutral, classy background
                            color: 'text.primary',
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: theme.palette.action.hover,
                                boxShadow: 'none',
                            }
                        }}
                    >
                        {/* The icon is now styled directly, making it a subtle accent */}
                        <type.Icon sx={{ mr: 2, color: type.color }} />
                        <Box>
                            <Typography sx={{ fontWeight: 'medium' }}>{type.label}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary', whiteSpace: 'normal' }}>{type.description}</Typography>
                        </Box>
                    </Button>
                ))}
            </Stack>
        </Box>
    );
};