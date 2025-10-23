import React from "react"
import { Paper, Typography, Box, Skeleton, Stack } from "@mui/material"

// A helper to format the percentage change text and determine color
const formatChange = (changeValue) => {
  if (changeValue === null || changeValue === undefined || isNaN(changeValue)) {
    return { text: "no data", color: "text.secondary" }
  }
  
  if (changeValue === 0) {
    return { text: "no change", color: "text.secondary" }
  }
  
  const text =
    changeValue > 0
      ? `${changeValue.toFixed(2)}% more`
      : `${Math.abs(changeValue).toFixed(2)}% less`
  const color = changeValue > 0 ? "error.main" : "success.main"
  return { text, color }
}

export const AISummary = ({ summary, isLoading }) => {
  if (isLoading) {
    // Skeleton loader
    return (
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 3, height: "100%" }}>
        <Stack spacing={1.5}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="40%" />
          <Skeleton
            variant="text"
            sx={{ fontSize: "clamp(2rem, 5vw, 2.5rem)" }}
            width="60%"
          />
          <Skeleton
            variant="text"
            sx={{ fontSize: "1rem", mt: 1 }}
            width="90%"
          />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="80%" />
        </Stack>
      </Paper>
    )
  }

  const { totalSpent, changeVsPreviousMonth, topCategory } = summary || {}
  const prevMonthChange = formatChange(changeVsPreviousMonth)

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        flexGrow: 1,
      }}
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Total Spending This Month
        </Typography>

        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "clamp(2rem, 5vw, 2.5rem)",
            lineHeight: 1.2,
          }}
        >
          {totalSpent?.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ pt: 1, textAlign: "center" }}
        >
          This was about{" "}
          <Box
            component="span"
            sx={{
              fontWeight: "bold",
              color: prevMonthChange.color,
              fontSize: "1.1em",
            }}
          >
            {prevMonthChange.text}
          </Box>{" "}
          than its previous month.
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Your top spending category was{" "}
          <Box
            component="span"
            sx={{
              fontWeight: "bold",
              color: "text.primary",
              fontSize: "1.1em",
              wordBreak: "break-word",
            }}
          >
            '{topCategory}'
          </Box>
          .
        </Typography>
      </Stack>
    </Paper>
  )
}