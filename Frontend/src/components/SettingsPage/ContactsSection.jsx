import React, { useState, useRef } from 'react';
import { Paper, Typography, Box, Stack, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Skeleton, Divider, Tooltip, ClickAwayListener, useMediaQuery, useTheme, IconButton, Collapse } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useContacts } from '../../hooks/useContacts';
import { AddContactModal } from '../auth/AddContactModal';

const EmptyState = () => (
    <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
        <PeopleOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h6" gutterBottom>No Contacts Yet</Typography>
        <Typography variant="body2">Add your first contact to get started.</Typography>
    </Box>
);

export const ContactsSection = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [isModalOpen, setModalOpen] = useState(false);
    const { data: contacts, isLoading } = useContacts();
    
    const [isExpanded, setIsExpanded] = useState(false);
    const [openTooltip, setOpenTooltip] = useState(null);
    const tooltipTimer = useRef();

    const handleAvatarClick = (contactId) => {
        if (isMobile) {
            clearTimeout(tooltipTimer.current);
            setOpenTooltip(contactId);
            tooltipTimer.current = setTimeout(() => {
                setOpenTooltip(null);
            }, 1500); // Auto-close after 1.5 seconds
        }
    };

    const handleTooltipClose = () => {
        setOpenTooltip(null);
        clearTimeout(tooltipTimer.current);
    };
    
    const handleAddContactClick = (e) => {
        e.stopPropagation();
        setModalOpen(true);
    };

    return (
        <>
            <Paper variant="outlined" sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() => setIsExpanded(prev => !prev)}
                    sx={{ p: 3, cursor: 'pointer' }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Manage Contacts</Typography>
                    <ExpandMoreIcon sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
                </Stack>
                
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Divider />
                    <ClickAwayListener onClickAway={handleTooltipClose}>
                        <Box>
                             {/* --- Action Bar --- */}
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, pt: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Your saved contacts
                                </Typography>
                                {isMobile ? (
                                    <IconButton onClick={handleAddContactClick} color="primary">
                                        <AddIcon />
                                    </IconButton>
                                ) : (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={handleAddContactClick}
                                    >
                                        Add Contact
                                    </Button>
                                )}
                            </Stack>
                            {/* --- List --- */}
                            <Box sx={{ maxHeight: 300, overflowY: 'auto', p: 2 }} onScroll={handleTooltipClose}>
                                {isLoading ? (
                                    <Stack spacing={1}>
                                        {Array.from(new Array(3)).map((_, i) => <Skeleton key={i} variant="rounded" height={56} />)}
                                    </Stack>
                                ) : !contacts || contacts.length === 0 ? (
                                    <EmptyState />
                                ) : (
                                    <List disablePadding>
                                        {contacts.map(contact => (
                                            <ListItem key={contact._id} disablePadding sx={{ mb: 1 }}>
                                                <Tooltip
                                                    title={contact.name}
                                                    arrow
                                                    placement="top-start"
                                                    open={isMobile ? openTooltip === contact._id : undefined}
                                                    onClose={handleTooltipClose}
                                                    disableFocusListener={isMobile}
                                                    disableTouchListener={isMobile}
                                                >
                                                    <Box
                                                        sx={{ 
                                                            display: 'flex', alignItems: 'center', width: '100%', 
                                                            p: '8px 16px', borderRadius: 1.5,
                                                            '&:hover': { bgcolor: 'action.hover' },
                                                        }}
                                                    >
                                                        <ListItemAvatar sx={{ cursor: 'pointer' }} onClick={() => handleAvatarClick(contact._id)}>
                                                            <Avatar sx={{ bgcolor: 'accent.main', color: 'accent.contrastText' }}>
                                                                {contact.name.charAt(0).toUpperCase()}
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={contact.name}
                                                            secondary={contact.phoneNumber}
                                                            primaryTypographyProps={{ noWrap: true, fontWeight: 'medium' }}
                                                            secondaryTypographyProps={{ noWrap: true }}
                                                        />
                                                    </Box>
                                                </Tooltip>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        </Box>
                    </ClickAwayListener>
                </Collapse>
            </Paper>
            <AddContactModal open={isModalOpen} onClose={() => setModalOpen(false)} />
        </>
    );
};