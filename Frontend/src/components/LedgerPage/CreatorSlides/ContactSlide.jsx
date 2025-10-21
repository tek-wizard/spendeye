import React, { useState, useMemo } from 'react';
import {
    Box,
    Stack,
    TextField,
    InputAdornment,
    List,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    CircularProgress,
    Fade,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useContacts } from '../../../hooks/useContacts';

export const ContactSlide = ({ onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: contacts, isLoading } = useContacts();

    const filteredContacts = useMemo(() => {
        if (!contacts) return [];
        const results = contacts.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        results.sort((a, b) => a.name.localeCompare(b.name));
        return results.slice(0, 3);
    }, [contacts, searchTerm]);

    return (
        <Stack spacing={2}>
            <TextField
                fullWidth
                autoFocus
                size="small"
                variant="outlined"
                placeholder="Who is this transaction with?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                        </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5 }
                }}
            />
            <Box sx={{ minHeight: 180 }}>
                {isLoading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
                <Fade in={!isLoading}>
                    <List disablePadding>
                        {filteredContacts.map(contact => (
                            <ListItemButton
                                key={contact._id}
                                onClick={() => onSelect(contact)}
                                sx={{ borderRadius: 2, mb: 0.5 }}
                            >
                                <Tooltip title={contact.name} arrow placement="top">
                                    <ListItemAvatar sx={{ minWidth: 48 }}>
                                        <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                                            {contact.name.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                </Tooltip>
                                <ListItemText
                                    primary={contact.name}
                                    primaryTypographyProps={{
                                        style: {
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }
                                    }}
                                />
                            </ListItemButton>
                        ))}
                        {filteredContacts.length === 0 && !isLoading && (
                            <Typography color="text.secondary" sx={{ p: 4, textAlign: 'center' }}>
                                No contacts found.
                            </Typography>
                        )}
                    </List>
                </Fade>
            </Box>
        </Stack>
    );
};