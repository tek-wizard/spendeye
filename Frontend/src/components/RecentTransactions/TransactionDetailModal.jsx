import React, { useMemo } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Divider,
  Avatar,
  Tooltip,
  IconButton,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { format } from "date-fns"

// Icons
import CloseIcon from "@mui/icons-material/Close"
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined"
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined"
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined"
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined"

// ✅ Improved, flexible DetailRow that supports long notes
const DetailRow = ({ icon, label, value, isNote = false }) => (
  <Stack direction="row" alignItems="flex-start" spacing={2} sx={{ py: 1.5 }}>
    {icon}
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: "medium",
          whiteSpace: isNote ? "pre-wrap" : "normal",
          wordBreak: isNote ? "break-word" : "normal",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Stack>
)

export const TransactionDetailModal = ({
  transaction,
  open,
  onClose,
  onEdit,
  onDelete,
  isLocked,
}) => {
  const theme = useTheme()

  // ✅ Build participants array for split expenses
  const participants = useMemo(() => {
    if (!transaction || !transaction.isSplit) return []

    const you = {
      name: "You",
      amount: transaction.personalShare || 0,
    }

    const others = (transaction.splitDetails || []).map((detail) => ({
      name: detail.person,
      amount: detail.amountOwed,
    }))

    return [you, ...others]
  }, [transaction])

  if (!transaction) return null

  const iconColor = theme.palette.accent.main
  const noteText = transaction.notes || transaction.description

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ textAlign: "center", p: 3, pt: 0 }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            bgcolor: transaction.color || "secondary.main",
            color: "primary.contrastText",
            mx: "auto",
            mb: 1,
          }}
        >
          {transaction.icon}
        </Avatar>

        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {(transaction.totalAmount || transaction.amount || 0).toLocaleString(
            "en-IN",
            { style: "currency", currency: "INR" }
          )}
        </Typography>

        <Stack divider={<Divider />} sx={{ mt: 3, textAlign: "left" }}>
          <DetailRow
            icon={<LocalOfferOutlinedIcon sx={{ color: iconColor, mt: "4px" }} />}
            label="Category"
            value={transaction.type || transaction.category}
          />
          <DetailRow
            icon={<CalendarTodayOutlinedIcon sx={{ color: iconColor, mt: "4px" }} />}
            label="Date & Time"
            value={format(new Date(transaction.date), "MMMM do, yyyy 'at' h:mm a")}
          />

          {/* ✅ Properly wrapped Notes row */}
          {noteText && (
            <DetailRow
              icon={<NotesOutlinedIcon sx={{ color: iconColor, mt: "4px" }} />}
              label="Notes"
              value={noteText}
              isNote={true}
            />
          )}

          {transaction.isSplit && (
            <DetailRow
              icon={<AccountCircleOutlinedIcon sx={{ color: iconColor, mt: "4px" }} />}
              label="Your Personal Share"
              value={(transaction.personalShare || 0).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}
            />
          )}

          {transaction.isSplit && participants.length > 0 && (
            <Stack
              direction="row"
              spacing={2}
              sx={{ py: 1.5, alignItems: "flex-start" }}
            >
              <GroupOutlinedIcon sx={{ color: iconColor, mt: "4px" }} />
              <Box sx={{ width: "100%", overflow: "hidden" }}>
                <Typography variant="caption" color="text.secondary">
                  Split Between
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    overflowX: "auto",
                    py: 1,
                    pr: "2px",
                  }}
                >
                  {participants.map((p, index) => (
                    <Stack
                      key={index}
                      alignItems="center"
                      spacing={0.5}
                      sx={{ minWidth: 70, flexShrink: 0 }}
                    >
                      <Tooltip title={p.name}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor:
                              p.name === "You" ? "primary.main" : "accent.main",
                            color:
                              p.name === "You"
                                ? "primary.contrastText"
                                : "accent.contrastText",
                          }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                      <Typography
                        noWrap
                        variant="caption"
                        sx={{ width: "100%", textAlign: "center" }}
                      >
                        {p.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        ₹{p.amount.toFixed(2)}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Box>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
        <Tooltip
          title={
            isLocked
              ? "This expense is linked to a ledger entry and cannot be deleted here."
              : ""
          }
        >
          <span>
            <Button color="error" onClick={onDelete} disabled={isLocked}>
              Delete
            </Button>
          </span>
        </Tooltip>
        <Button variant="contained" onClick={onEdit}>
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  )
}
