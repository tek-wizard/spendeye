import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, Stack, Avatar, Button, TextField, IconButton, CircularProgress} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';

// Validation schema for the username
const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Cannot be longer than 30 characters"),
});

export const ProfileSection = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { updateProfile, isUpdatingProfile } = useUpdateProfile();
    
    const { register, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: user.username,
        }
    });

    // Sync form state if the user prop changes from the parent
    useEffect(() => {
        setValue('username', user.username);
    }, [user, setValue]);

    const onSubmit = (data) => {
        updateProfile(data, {
            onSuccess: () => {
                setIsEditing(false); // Close edit mode on success
            }
        });
    };

    const handleCancel = () => {
        setValue('username', user.username); // Revert changes
        setIsEditing(false);
    };

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
                    <Avatar sx={{ width: 80, height: 80, fontSize: '2.5rem', bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        {user.username.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box sx={{ flexGrow: 1, width: '100%' }}>
                        {isEditing ? (
                            <TextField
                                label="Username"
                                {...register("username")}
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                fullWidth
                                autoFocus
                                disabled={isUpdatingProfile}
                            />
                        ) : (
                            <Stack>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {user.username}
                                </Typography>
                                <Typography color="text.secondary">
                                    {user.email}
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    {isEditing ? (
                        <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                            <Button onClick={handleCancel} disabled={isUpdatingProfile}>Cancel</Button>
                            <Button type="submit" variant="contained" disabled={isUpdatingProfile}>
                                {isUpdatingProfile ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                            </Button>
                        </Stack>
                    ) : (
                        <Button
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => setIsEditing(true)}
                            sx={{ flexShrink: 0 }}
                        >
                            Edit
                        </Button>
                    )}
                </Stack>
            </form>
        </Paper>
    );
};