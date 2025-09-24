import React, { useState, useMemo } from "react"
import {
  Box,
  Typography,
  TextField,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material"
import { CircularProgress } from "@mui/material"

//hooks
import { useContacts } from "../../../../hooks/useContacts" // You will need to create this hook

// Assume you have a central place for this mock data, maybe api/contactService.js
// const mockContacts = [
//   { id: 'contact_1', name: 'Alice Smith', phone: '123-456-7890' },
//   { id: 'contact_4', name: 'Diana Prince', phone: '234-567-8901' },
//   { id: 'contact_5', name: 'Bruce Wayne', phone: '345-678-9012' },
// ];

export const SelectContactStep = ({ onSelect }) => {
  const [searchValue, setSearchValue] = useState("")
  const { data: contacts, isLoading } = useContacts()

  const filteredContacts = useMemo(() => {
    if (!contacts || !searchValue) {
      return contacts || []; 
    }
    return contacts.filter(c => c.name.toLowerCase().includes(searchValue.toLowerCase()));
  }, [searchValue, contacts]);

  if (isLoading) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
            <CircularProgress />
        </Box>
    );
  }


  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
        Who lent you money?
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Search contacts..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        sx={{ mt: 2, width: "100%", maxWidth: 350 }}
      />
      <List
        sx={{
          mt: 1,
          maxHeight: 250,
          overflowY: "auto",
          width: "100%",
          maxWidth: 350,
        }}
      >
        {filteredContacts.map((contact) => (
          <ListItemButton key={contact.id} onClick={() => onSelect(contact)}>
            <ListItemText
              primary={contact.name}
              secondary={contact.phone}
              slotProps={{
                primary: {
                  noWrap: true,
                  sx: {
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                },
                secondary: {
                  noWrap: true,
                  sx: {
                    flex: 1,
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                },
              }}
            />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={() => alert("Open Add New Contact form")}>
          <ListItemText
            primary="Add New Contact"
            sx={{ color: "primary.main" }}
          />
        </ListItemButton>
      </List>
    </Box>
  )
}
