import React from 'react';
import { Box, Typography, Button, Divider,Stack } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

export const SocialAuthDivider = () => {
    return (
        <Stack spacing={2} sx={{ mb: 3 }}>
            <Button
                variant="outlined"
                startIcon={<GoogleIcon />}
                size="large"
                fullWidth
                // The actual OAuth logic would start here
                onClick={() => console.log('Initiate Google OAuth')}
            >
                Continue with Google
            </Button>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="text.secondary">OR</Typography>
                <Divider sx={{ flexGrow: 1 }} />
            </Box>
        </Stack>
    );
};