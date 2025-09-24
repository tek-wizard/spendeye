import React from "react"
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material"
import { format } from "date-fns" // We'll need the date formatter

export const ConfirmSettlementStep = ({ selectedContacts }) => {
  const todayFormatted = format(new Date(), "MMMM do, yyyy") // e.g., "September 12th, 2025"

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold" }}>
        Confirm New Expenses
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        gutterBottom
      >
        The following expenses will be created to settle your debts.
      </Typography>
      <List
        sx={{
          mt: 2,
          bgcolor: "background.default",
          borderRadius: 2,
          maxHeight: 350,
          overflowY: "auto",
        }}
      >
        {selectedContacts.map((contact, index) => (
          <React.Fragment key={contact.id}>
            <ListItem>
              <ListItemText
                primary={`Payment to ${contact.name}`}
                secondary={`Amount: ₹${contact.amount.toFixed(2)}`}
                slotProps={{
                  primary: {
                    sx: {
                      fontWeight: "bold",
                      textAlign: "center", 
                      width: "100%",
                    },
                  },
                  secondary: {
                    sx: {
                      textAlign: "center", 
                      width: "100%",
                    },
                  },
                }}
              />
            </ListItem>
            <ListItem sx={{ display: "block", pt: 0 }}>
              {/* ...and replace its content with this: */}
              <Typography variant="caption" color="text.primary">
                Category:{" "}
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Debt Repayment
                </Box>
              </Typography>
              <br />
              <Typography variant="caption" color="text.primary">
                Date:{" "}
                <Box component="span" sx={{ color: "text.secondary" }}>
                  {todayFormatted}
                </Box>
              </Typography>
              <br />
              <Typography variant="caption" color="text.primary">
                Note:{" "}
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Debt repayment to {contact.name}
                </Box>
              </Typography>
            </ListItem>
            {index < selectedContacts.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  )
}
