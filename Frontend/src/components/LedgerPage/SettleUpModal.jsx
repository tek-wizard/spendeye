import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  Typography,
  Stack,
  Button,
  DialogActions,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material"
import { useCreateLedgerEntry } from "../../hooks/useCreateLedgerEntry"
import CloseIcon from "@mui/icons-material/Close"

export const SettleUpModal = ({ open, onClose, person }) => {
  const { createLedgerEntry, isCreating } = useCreateLedgerEntry()
  const [note, setNote] = useState("")

  if (!person) return null

  const { person: name, netBalance } = person
  const owesYou = netBalance > 0
  const amountToSettle = Math.abs(netBalance)

  const handleSettle = () => {
    const ledgerEntryData = {
      person: name,
      amount: amountToSettle,
      type: owesYou ? "Received" : "Given",
      notes: note.trim() || `Settlement with ${name}`,
      date: new Date(),
    }

    createLedgerEntry(ledgerEntryData, {
      onSuccess: () => {
        setNote("")
        onClose()
      },
    })
  }

  const handleClose = () => {
    setNote("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      {/* --- Close Button --- */}
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>

      {/* --- Content --- */}
      <DialogContent sx={{ p: 3, pt: 5 }}>
        <Stack spacing={3} alignItems="center" textAlign="center">
          {/* --- Heading (Slightly Smaller) --- */}
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {owesYou
              ? "Confirm Receiving This Amount From"
              : "Confirm Paying This Amount To"}
          </Typography>
          
          {/* --- Name (Prominent) --- */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mb: -0.5,
              wordBreak: "break-word",
              whiteSpace: "normal",
              maxWidth: "100%",
            }}
          >
            {name}
          </Typography>

          {/* --- Amount --- */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              mt: 1,
            }}
          >
            {amountToSettle.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
            })}
          </Typography>

          {/* --- Optional Note (with counter) --- */}
          <TextField
            label="Note (Optional)"
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            inputProps={{ maxLength: 200 }}
            helperText={`${note.length} / 200`}
            fullWidth
          />
        </Stack>
      </DialogContent>

      {/* --- Action Button --- */}
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          onClick={handleSettle}
          variant="contained"
          size="large"
          disabled={isCreating}
          color="primary"
        >
          {isCreating ? (
            <CircularProgress size={24} color="inherit" />
          ) : owesYou ? (
            "Confirm Received"
          ) : (
            "Confirm Paid"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
