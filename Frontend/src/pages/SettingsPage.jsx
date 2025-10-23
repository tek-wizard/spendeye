import React from 'react';
import { Box, Typography, Stack, Skeleton,Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';

import { ProfileSection } from '../components/SettingsPage/ProfileSection';
import { FinancialsSection } from '../components/SettingsPage/FinancialsSection';
import { SecuritySection } from '../components/SettingsPage/SecuritySection';
import { ContactsSection } from '../components/SettingsPage/ContactsSection';
import { DangerZone } from '../components/SettingsPage/DangerZone';

const SettingsPage = () => {
    const { user, isLoading } = useAuth();

    if (isLoading || !user) {
        return (
            <Stack spacing={3}>
                <Skeleton variant="text" width="40%" height={40} />
                <Skeleton variant="rounded" height={120} />
                <Skeleton variant="rounded" height={80} />
                <Skeleton variant="rounded" height={80} />
                <Skeleton variant="rounded" height={200} />
            </Stack>
        );
    }

    return (
        <Box>
            <Stack spacing={3}>
                <ProfileSection user={user} />
                <FinancialsSection user={user} />
                <SecuritySection user={user} />
                <ContactsSection user={user} />
                <DangerZone />
            </Stack>
        </Box>
    );
};

export default SettingsPage;