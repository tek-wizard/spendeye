import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Stack,
  Button,
  Divider,
  CircularProgress,
  ListItemAvatar,
  Avatar,
  ListItem,
  IconButton,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { useContacts } from "../../../hooks/useContacts";

const EmptyContactsState = ({ onAddNew }) => (
  <Box sx={{ textAlign: "center", p: 4, color: "text.secondary" }}>
    <PeopleOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
    <Typography variant="h6" gutterBottom>No Contacts Yet</Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>Add a contact to get started with splitting expenses.</Typography>
    <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={onAddNew}>
      Add Your First Contact
    </Button>
  </Box>
);

// UPDATED: Now receives onAddNewContact prop and no longer manages the modal
export const ContactsStep = ({ formData, updateFormData, onAddNewContact }) => {
  const [searchValue, setSearchValue] = useState("");
  const { data: contacts, isLoading } = useContacts();

  const filteredContacts = useMemo(() => {
    if (!contacts) return [];
    if (!searchValue) return contacts;
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, contacts]);

  const isSelected = (contact) =>
    formData.contacts.some((c) => c._id === contact._id);

  const handleRemoveContact = (contactToRemove) => {
    const updatedContacts = formData.contacts.filter(
      (c) => c._id !== contactToRemove._id
    );
    updateFormData({ contacts: updatedContacts });
  };

  const toggleContact = (contact) => {
    if (isSelected(contact)) {
      handleRemoveContact(contact);
    } else {
      updateFormData({ contacts: [...formData.contacts, contact] });
    }
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", height: 450 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
        Select Contacts
      </Typography>
      <Typography variant="body2" align="center" color="text.secondary" gutterBottom>
        Choose who you're splitting this expense with.
      </Typography>

      {formData.contacts.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, py: 1, mt: 1, overflowX: "auto" }}>
          {formData.contacts.map((contact) => (
            <Chip
            key={contact._id}
            label={contact.name}
            onDelete={() => handleRemoveContact(contact)}
            sx={{
              bgcolor: "accent.main",
              color: "accent.contrastText",
              fontWeight: "medium",
              "& .MuiChip-deleteIcon": {
                color: "accent.contrastText",
                opacity: 0.6,
                "&:hover": { opacity: 1, color: "accent.contrastText" },
              },
            }}
          />
          ))}
        </Box>
      )}

      {contacts && contacts.length > 0 && (
        <>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Search by name..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ flexGrow: 1, overflowY: "auto", mt: 1, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
            <List dense>
              {filteredContacts.map((contact) => (
                <ListItem key={contact._id} secondaryAction={isSelected(contact) && (<IconButton edge="end"><CheckCircleIcon color="success" /></IconButton>)} disablePadding>
                  <ListItemButton onClick={() => toggleContact(contact)}>
                    <ListItemAvatar><Avatar sx={{ bgcolor: "accent.main", color: "accent.contrastText" }}>{contact.name.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
                    <ListItemText primary={contact.name} secondary={contact.phoneNumber || ""} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </>
      )}

      <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isLoading && <CircularProgress />}
        {!isLoading && (!contacts || contacts.length === 0) && (
          <EmptyContactsState onAddNew={onAddNewContact} />
        )}
      </Box>

      {contacts && contacts.length > 0 && (
        <>
          <Divider sx={{ my: 1 }} />
          <Button fullWidth startIcon={<AddCircleOutlineIcon />} onClick={onAddNewContact}>
            Add New Contact
          </Button>
        </>
      )}
    </Box>
    // The AddContactModal has been removed from here
  );
};