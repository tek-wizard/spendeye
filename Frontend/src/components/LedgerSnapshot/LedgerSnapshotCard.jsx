import React, { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Divider,
  Button,
  Fade,
  useMediaQuery,
  Tooltip,
  IconButton,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd" // Icon for creating a new entry

export const LedgerSnapshotCard = ({
  owedToYou,
  youOwe,
  owedCount,
  oweCount,
  onViewDebtorsClick,
  onViewCreditorsClick,
  onAddLedgerClick,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [isOwedHovered, setIsOwedHovered] = useState(false)
  const [isOweHovered, setIsOweHovered] = useState(false)
  const formatCurrency = (amount) =>
    `₹${parseFloat(amount).toLocaleString("en-IN")}`

  return (
    <Card sx={{ position: "relative" }}>
      <Tooltip title="Add New Ledger Entry">
        <IconButton
          onClick={onAddLedgerClick}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          <PlaylistAddIcon />
        </IconButton>
      </Tooltip>
      <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ledger Snapshot
        </Typography>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
        >
          <Box
            onMouseEnter={!isMobile ? () => setIsOwedHovered(true) : undefined}
            onMouseLeave={!isMobile ? () => setIsOwedHovered(false) : undefined}
            onClick={isMobile ? onViewDebtorsClick : undefined}
            sx={{
              flex: 1,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              background: `radial-gradient(circle at 50% 0%, ${theme.palette.success.main}08, transparent 70%)`,
            }}
          >
            <Stack spacing={1} alignItems="center">
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ color: "success.main", whiteSpace: "nowrap" }}
              >
                <ArrowUpwardIcon fontSize="small" />
                <Typography variant="body2">Owed to You</Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {formatCurrency(owedToYou)}
              </Typography>
              <Box
                sx={{
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isOwedHovered ? (
                  <Fade in={true}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewDebtorsClick()
                      }}
                    >
                      View
                    </Button>
                  </Fade>
                ) : (
                  <Fade in={true}>
                    <Typography variant="caption" color="text.secondary">
                      {owedCount > 0 ? (
                        `from ${owedCount} people`
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </Typography>
                  </Fade>
                )}
              </Box>
            </Stack>
          </Box>
          <Box
            onMouseEnter={!isMobile ? () => setIsOweHovered(true) : undefined}
            onMouseLeave={!isMobile ? () => setIsOweHovered(false) : undefined}
            onClick={isMobile ? onViewCreditorsClick : undefined}
            sx={{
              flex: 1,
              p: 2,
              textAlign: "center",
              cursor: "pointer",
              background: `radial-gradient(circle at 50% 0%, ${theme.palette.error.main}08, transparent 70%)`,
            }}
          >
            <Stack spacing={1} alignItems="center">
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ color: "error.main", whiteSpace: "nowrap" }}
              >
                <ArrowDownwardIcon fontSize="small" />
                <Typography variant="body2">You Owe</Typography>
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {formatCurrency(youOwe)}
              </Typography>
              <Box
                sx={{
                  minHeight: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isOweHovered ? (
                  <Fade in={true}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation()
                        onViewCreditorsClick()
                      }}
                    >
                      View
                    </Button>
                  </Fade>
                ) : (
                  <Fade in={true}>
                    <Typography variant="caption" color="text.secondary">
                      {oweCount > 0 ? (
                        `to ${oweCount} people`
                      ) : (
                        <span>&nbsp;</span>
                      )}
                    </Typography>
                  </Fade>
                )}
              </Box>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default LedgerSnapshotCard