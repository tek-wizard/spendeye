import React from "react"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { Typography, Box } from "@mui/material"

export const IOUDateStep = ({ formData, updateFormData }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1,
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Date of Loan
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        When did you receive the money?
      </Typography>
      <DatePicker
        label="Date Borrowed"
        value={formData.date}
        disableFuture={true}
        onChange={(newDate) => updateFormData({ date: newDate })}
        sx={{ width: "100%", maxWidth: "300px" }}
      />
    </Box>
  )
}
