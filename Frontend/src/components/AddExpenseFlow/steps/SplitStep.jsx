// src/components/AddExpenseFlow/steps/SplitStep.jsx

import React, { useEffect, useMemo } from "react"
import {
  Box,
  Typography,
  Button,
  List,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Alert,
  Stack,ListItem,ListItemText
} from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import CalculateIcon from "@mui/icons-material/Calculate"
// useTheme is no longer needed as we'll use theme tokens directly
// import { useTheme } from '@mui/material/styles';

export const SplitStep = ({ formData, updateFormData }) => {
  // const theme = useTheme(); // No longer needed

  const participants = useMemo(() => {
    const uniqueContacts = formData.contacts.map((contact) => ({
      ...contact,
      id: contact.id || contact.name,
    }))
    return [{ id: "user", name: "You" }, ...uniqueContacts]
  }, [formData.contacts])

  const getTotalSplit = () =>
    (formData.splits || []).reduce(
      (sum, split) => sum + (parseFloat(split.amount) || 0),
      0
    )
  const getRemainingAmount = () =>
    (parseFloat(formData.amount) || 0) - getTotalSplit()

  const totalSplit = getTotalSplit()
  const remainingAmount = getRemainingAmount()
  const totalExpenseAmount = parseFloat(formData.amount) || 0

  const splitEvenly = () => {
    if (isNaN(totalExpenseAmount) || participants.length === 0) return
    const share = totalExpenseAmount / participants.length
    const roundedShare = parseFloat(share.toFixed(2))
    let newSplits = participants.map((p) => ({
      participantId: p.id,
      amount: roundedShare,
    }))
    const sumOfRounded = roundedShare * participants.length
    const roundingDiff = totalExpenseAmount - sumOfRounded
    if (newSplits.length > 0) {
      newSplits[newSplits.length - 1].amount = parseFloat(
        (newSplits[newSplits.length - 1].amount + roundingDiff).toFixed(2)
      )
    }
    updateFormData({ splits: newSplits })
  }

  const updateSplit = (participantId, newAmount) => {
    const newSplits = (formData.splits || []).map((split) =>
      split.participantId === participantId
        ? { ...split, amount: parseFloat(newAmount) }
        : split
    )
    updateFormData({ splits: newSplits })
  }

  const removeParticipant = (participantToRemove) => {
    if (participantToRemove.id === "user") return
    const newContacts = formData.contacts.filter(
      (c) => c.id !== participantToRemove.id
    )
    const newSplits = (formData.splits || []).filter(
      (s) => s.participantId !== participantToRemove.id
    )
    updateFormData({ contacts: newContacts, splits: newSplits })
  }

  useEffect(() => {
    if (formData.splits.length === 0 && participants.length > 0) {
      splitEvenly()
    }
  }, [])

  useEffect(() => {
    if (formData.splits.length > 0 || participants.length > 0) {
      splitEvenly()
    }
  }, [formData.contacts, formData.amount])

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 350,
        alignItems: "center",
      }}
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
        Split Amount
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        How much does each person owe?
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          my: 2,
          width: "100%",
          maxWidth: 400,
        }}
      >
        {/* Hierarchical summary is already theme-compliant */}
        <Stack sx={{ display: { xs: "none", sm: "flex" } }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Total: ₹{totalExpenseAmount.toFixed(2)}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Split:{" "}
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: "medium" }}
            >
              ₹{totalSplit.toFixed(2)}
            </Box>{" "}
            | {remainingAmount < 0 ? "Exceeding:" : "Remaining:"}{" "}
            <Box
              component="span"
              sx={{
                color:
                  Math.abs(remainingAmount) > 0.01
                    ? "error.main"
                    : "text.primary",
                fontWeight: "medium",
              }}
            >
              ₹{Math.abs(remainingAmount).toFixed(2)}
            </Box>
          </Typography>
        </Stack>
        <Stack sx={{ display: { xs: "flex", sm: "none" } }}>
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Total:{" "}
            <Box component="span" sx={{ fontWeight: "bold" }}>
              ₹{totalExpenseAmount.toFixed(2)}
            </Box>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Split:{" "}
            <Box
              component="span"
              sx={{ color: "text.primary", fontWeight: "medium" }}
            >
              ₹{totalSplit.toFixed(2)}
            </Box>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {remainingAmount < 0 ? "Exceeding:" : "Remaining:"}{" "}
            <Box
              component="span"
              sx={{
                color:
                  Math.abs(remainingAmount) > 0.01
                    ? "error.main"
                    : "text.primary",
                fontWeight: "medium",
              }}
            >
              ₹{Math.abs(remainingAmount).toFixed(2)}
            </Box>
          </Typography>
        </Stack>

         <Button size="small" variant="contained" color="primary" onClick={splitEvenly} sx={{ flexShrink: 0 }} disabled={remainingAmount === 0}>
          Split Evenly
        </Button>
      </Box>

      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          flexGrow: 1,
          overflowY: "auto",
          maxHeight: 200,
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <List disablePadding>
          {participants.map((person) => {
            const splitItem = (formData.splits || []).find(
              (s) => s.participantId === person.id
            )
            const splitAmount =
              splitItem?.amount !== undefined ? splitItem.amount : ""

            return (
              <Box
                key={person.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  mb: 2,
                  gap: 1.5,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    mb: 0.5,
                    bgcolor: 'accent.main', color: 'accent.contrastText'
                  }}
                >
                  {person.name.charAt(0).toUpperCase()}
                </Avatar>
                <TextField
                  label={person.name}
                  fullWidth
                  size="small"
                  type="number"
                  placeholder="0.00"
                  value={splitAmount}
                  onChange={(e) => updateSplit(person.id, e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  variant="standard"
                  sx={{
                    "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
                      { WebkitAppearance: "none", margin: 0 },
                    "& input[type=number]": { MozAppearance: "textfield" },
                  }}
                />
                
                {person.id !== "user" ? (
                  <IconButton
                    aria-label="delete"
                    onClick={() => removeParticipant(person)}
                    sx={{ color: "text.secondary", p: 0.5 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <Box sx={{ width: 32, height: 32, flexShrink: 0 }} />
                )}
              </Box>
            )
          })}
        </List>
      </Box>

      <ListItem sx={{ mt: 1 }}>
            <ListItemText primary="Amount Unassigned" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} />
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: remainingAmount === 0 ? 'success.main' : 'error.main' }}>
              ₹{remainingAmount.toFixed(2)}
            </Typography>
          </ListItem>

      {/* {Math.abs(remainingAmount) > 0.01 && (
        <Alert severity="warning" sx={{ mt: 1, width: "100%", maxWidth: 400 }}>
          Split amounts don't match the total expense.
        </Alert>
      )} */}
    </Box>
  )
}

export default SplitStep