import React, { useState, useMemo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
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

export const ViewCreditorsModal = ({ open, onClose, creditors }) => {
  const [searchValue, setSearchValue] = useState("")

  // Filter the list based on the search input
  const filteredCreditors = useMemo(() => {
    if (!searchValue) {
      return creditors
    }
    return creditors.filter((creditor) =>
      creditor.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [creditors, searchValue])

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ textAlign: "center", p: 3, pb: 2 }}>
        <Avatar sx={{ bgcolor: "error.main", mx: "auto", mb: 1 }}>
          <AccountBalanceWalletOutlinedIcon />
        </Avatar>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          People You Owe
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

        {filteredCreditors.length > 0 ? (
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
            {filteredCreditors.map((creditor) => (
              <ListItem key={creditor.id}>
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: "accent.main",
                      color: "accent.contrastText",
                    }}
                  >
                    {creditor.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={creditor.name}
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
                <Typography sx={{ color: "error.main", fontWeight: "bold" }}>
                  ₹{creditor.amount.toFixed(2)}
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
