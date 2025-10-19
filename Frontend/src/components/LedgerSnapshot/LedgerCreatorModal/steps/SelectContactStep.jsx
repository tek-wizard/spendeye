import React, { useState, useMemo } from "react";
import {
  Box, Typography, TextField, List, ListItemButton,
  ListItemText, Divider, CircularProgress, Button,
  ListItemAvatar, Avatar,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useContacts } from "../../../../hooks/useContacts";
import { useDebtors } from "../../../../hooks/useDebtors";
import { useCreditors } from "../../../../hooks/useCreditors";

// Updated helper to be more subtle and use the requested text
const BalanceAnnotation = ({ balance }) => {
  if (!balance) {
    return <Typography variant="caption" color="text.secondary">Settled</Typography>;
  }
  
  const color = balance.status === 'owesYou' ? 'success.main' : 'error.main';
  const text = balance.status === 'owesYou' ? `Owes you ₹${balance.amount.toFixed(2)}` : `You owe ₹${balance.amount.toFixed(2)}`;

  // Using a less prominent color and font weight for subtlety
  return <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>{text}</Typography>;
};

export const SelectContactStep = ({ onSelect, type, selectedContact, onAddNewContact }) => {
  const [searchValue, setSearchValue] = useState("");

  const { data: allContacts, isLoading: areContactsLoading } = useContacts();
  const { data: debtors, isLoading: areDebtorsLoading } = useDebtors();
  const { data: creditors, isLoading: areCreditorsLoading } = useCreditors();

  // The logic is now simplified to create a single, smart-sorted list
  const contactList = useMemo(() => {
    if (!allContacts || !debtors || !creditors) return [];

    // 1. Create a quick lookup map for balances
    const balanceMap = {};
    debtors.forEach(d => (balanceMap[d.name] = { status: 'owesYou', amount: d.amount }));
    creditors.forEach(c => (balanceMap[c.name] = { status: 'youOwe', amount: c.amount }));

    // 2. Annotate all contacts with their balance info
    const annotatedContacts = allContacts.map(c => ({ ...c, balance: balanceMap[c.name] }));

    // 3. Smart-sort the list: people with balances on top, then alphabetically
    annotatedContacts.sort((a, b) => {
      const aHasBalance = !!a.balance;
      const bHasBalance = !!b.balance;
      if (aHasBalance && !bHasBalance) return -1; // a comes first
      if (!aHasBalance && bHasBalance) return 1;  // b comes first
      return a.name.localeCompare(b.name); // otherwise, sort by name
    });

    return annotatedContacts;

  }, [allContacts, debtors, creditors]);
  
  const filteredContacts = useMemo(() => {
    if (!searchValue) return contactList;
    return contactList.filter((c) =>
      c.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, contactList]);

  const title = {
    Given: "Who are you giving money to?",
    Received: "Who are you receiving money from?",
  }[type] || "Select a Contact";

  const isLoading = areContactsLoading || areDebtorsLoading || areCreditorsLoading;

  if (isLoading) return <CircularProgress />;

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", height: 450 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}> {title} </Typography>
      <TextField
        fullWidth variant="outlined" size="small"
        placeholder="Search by name..." value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ mt: 2, width: "100%", maxWidth: 350 }}
      />

      <Box sx={{ flexGrow: 1, width: "100%", maxWidth: 350, overflowY: "auto", mt: 1 }}>
        <List>
          {filteredContacts.map((contact) => (
            <ListItemButton key={contact.id} onClick={() => onSelect(contact)} selected={selectedContact?.id === contact.id}>
              <ListItemAvatar><Avatar sx={{ bgcolor: "accent.main", color: "accent.contrastText" }}>{contact.name.charAt(0).toUpperCase()}</Avatar></ListItemAvatar>
              <ListItemText
                primary={contact.name}
                secondary={<BalanceAnnotation balance={contact.balance} />}
                primaryTypographyProps={{ style: { whiteSpace: 'normal', wordBreak: 'break-word' } }}
              />
            </ListItemButton>
          ))}
           {filteredContacts.length === 0 && (
            <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
              <Typography variant="body2">No contacts found.</Typography>
            </Box>
          )}
        </List>
      </Box>

      <Box sx={{ width: "100%", maxWidth: 350, pt: 1 }}>
        <Divider sx={{ mb: 1 }} />
        <Button fullWidth startIcon={<AddCircleOutlineIcon />} onClick={onAddNewContact}>
          Add New Contact
        </Button>
      </Box>
    </Box>
  );
};