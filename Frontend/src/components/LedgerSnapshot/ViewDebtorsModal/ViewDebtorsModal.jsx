// src/components/LedgerSnapshot/ViewDebtorsModal.jsx

import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
  ListItemAvatar,
  Box,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material"

// Icons
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"

export const ViewDebtorsModal = ({ open, onClose, debtors }) => {
  const [searchValue, setSearchValue] = useState("")

  // Filter the list based on the search input
  const filteredDebtors = useMemo(() => {
    if (!searchValue) {
      return debtors
    }
    return debtors.filter((debtor) =>
      debtor.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [debtors, searchValue])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", p: 3 }}>
        <Avatar sx={{ bgcolor: "success.main", mx: "auto", mb: 1 }}>
          <AccountBalanceWalletOutlinedIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          People Who Owe You
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 0 }}>
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search by name..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {filteredDebtors.length > 0 ? (
          <List
            sx={{
              maxHeight: {
                xs: 350, // small screens (mobile)
                sm: 500, // tablets
                md: 600, // desktops
                lg: 650, // large desktops
              },
              overflowY: "auto",
            }}
          >
            {filteredDebtors.map((debtor) => (
              <ListItem key={debtor.id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "accent.main",
                      color: "accent.contrastText",
                    }}
                  >
                    {debtor.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={debtor.name}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: "medium",
                        flex: 1,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    },
                  }}
                />
                <Typography sx={{ color: "success.main", fontWeight: "bold" }}>
                  ₹{debtor.amount.toFixed(2)}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
            <Typography>No results found for "{searchValue}"</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}
