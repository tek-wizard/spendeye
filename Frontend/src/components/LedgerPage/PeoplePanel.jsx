import React, { useState, useMemo } from "react"
import {
  Box,
  Typography,
  Paper,
  Stack,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Skeleton,
  IconButton,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import SearchIcon from "@mui/icons-material/Search"
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline"
import FilterListIcon from "@mui/icons-material/FilterList"
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted"

const StatusBadge = styled(Badge)(({ theme, ownerState }) => ({
  "& .MuiBadge-badge": {
    backgroundColor:
      ownerState.status === "owesYou"
        ? theme.palette.success.main
        : ownerState.status === "youOwe"
        ? theme.palette.error.main
        : "transparent",
    color:
      ownerState.status === "owesYou"
        ? theme.palette.success.main
        : ownerState.status === "youOwe"
        ? theme.palette.error.main
        : "transparent",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      content: '""',
    },
  },
}))

// --- EMPTY STATE ---
const EmptyState = ({ isSearchOrFilter }) => (
  <Box
    sx={{
      textAlign: "center",
      p: 4,
      color: "text.secondary",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <PeopleOutlineIcon sx={{ fontSize: 48, mb: 2 }} />
    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
      {isSearchOrFilter ? "No Matches Found" : "No Contacts"}
    </Typography>
    <Typography variant="body2">
      {isSearchOrFilter
        ? "Try a different search or filter."
        : "Your contacts with ledger history will appear here."}
    </Typography>
  </Box>
)

export const PeoplePanel = ({
  people,
  isLoading,
  selectedPerson,
  onSelectPerson,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)
  const [balanceFilter, setBalanceFilter] = useState("all")

  // --- FILTER MENU HANDLERS ---
  const handleFilterMenuOpen = (event) =>
    setFilterMenuAnchor(event.currentTarget)
  const handleFilterMenuClose = () => setFilterMenuAnchor(null)
  const handleFilterSelect = (filter) => {
    setBalanceFilter(filter)
    handleFilterMenuClose()
  }

  // --- SORTING + FILTERING LOGIC ---
  const sortedAndFilteredPeople = useMemo(() => {
    if (!people) return []

    let processedList = [...people]

    if (balanceFilter === "owedToYou") {
      processedList = processedList.filter((p) => p.netBalance > 0)
    } else if (balanceFilter === "youOwe") {
      processedList = processedList.filter((p) => p.netBalance < 0)
    } else if (balanceFilter === "settled") {
      processedList = processedList.filter((p) => p.netBalance === 0)
    }

    if (searchTerm) {
      processedList = processedList.filter((p) =>
        p.person.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return processedList.sort((a, b) => {
      const aOwesYou = a.netBalance > 0
      const bOwesYou = b.netBalance > 0
      const aYouOwe = a.netBalance < 0
      const bYouOwe = b.netBalance < 0

      if (aYouOwe && !bYouOwe) return -1
      if (!aYouOwe && bYouOwe) return 1
      if (aOwesYou && !bOwesYou) return -1
      if (!aOwesYou && bOwesYou) return 1

      return a.person.localeCompare(b.person)
    })
  }, [people, searchTerm, balanceFilter])

  // --- RENDER ---
  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 2,
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* --- SEARCH + FILTER BAR --- */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Find a person..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Filter by Balance">
            <IconButton onClick={handleFilterMenuOpen}>
              <Badge
                color="primary"
                variant="dot"
                invisible={balanceFilter === "all"}
              >
                <FilterListIcon />
              </Badge>
            </IconButton>
          </Tooltip>
        </Stack>

        {/* --- LIST CONTENT --- */}
        <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
          {isLoading ? (
            <Stack spacing={1} sx={{ p: 1 }}>
              {Array.from(new Array(8)).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={60} />
              ))}
            </Stack>
          ) : sortedAndFilteredPeople.length === 0 ? (
            <EmptyState
              isSearchOrFilter={!!searchTerm || balanceFilter !== "all"}
            />
          ) : (
            <List sx={{ p: 1 }}>
              {sortedAndFilteredPeople.map(({ person, netBalance }) => {
                const owesYou = netBalance > 0
                const status =
                  netBalance === 0 ? "settled" : owesYou ? "owesYou" : "youOwe"
                const balanceText =
                  netBalance === 0
                    ? `Settled up`
                    : owesYou
                    ? `Owes you ₹${netBalance.toLocaleString()}`
                    : `You owe ₹${Math.abs(netBalance).toLocaleString()}`

                return (
                  <ListItemButton
                    key={person}
                    selected={selectedPerson?.person === person}
                    onClick={() => onSelectPerson({ person, netBalance })}
                    sx={{ borderRadius: 1.5, mb: 1 }}
                  >
                    <Tooltip title={person} placement="top-start">
                      <ListItemAvatar>
                        <StatusBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                          invisible={status === "settled"}
                          ownerState={{ status }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: "accent.main",
                              color: "accent.contrastText",
                            }}
                          >
                            {person.charAt(0).toUpperCase()}
                          </Avatar>
                        </StatusBadge>
                      </ListItemAvatar>
                    </Tooltip>

                    {/* Truncate & Reveal name */}
                    <ListItemText
                      primary={person}
                      secondary={balanceText}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: "medium",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontSize: {
                            xs: "0.95rem",
                            sm: "1rem",
                            md: "1.05rem",
                          },
                        },
                      }}
                      secondaryTypographyProps={{
                        color:
                          netBalance === 0
                            ? "text.secondary"
                            : owesYou
                            ? "success.main"
                            : "error.main",
                        fontWeight: "regular",
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.85rem",
                        },
                      }}
                      sx={{ my: 0 }}
                    />
                  </ListItemButton>
                )
              })}
            </List>
          )}
        </Box>
      </Paper>

      {/* --- FILTER MENU --- */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterMenuClose}
        PaperProps={{ sx: { mt: 1, borderRadius: 2 } }}
      >
        <MenuItem
          onClick={() => handleFilterSelect("all")}
          selected={balanceFilter === "all"}
        >
          <ListItemIcon>
            <FormatListBulletedIcon fontSize="small" />
          </ListItemIcon>
          Show All
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => handleFilterSelect("owedToYou")}
          selected={balanceFilter === "owedToYou"}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "success.main",
              }}
            />
          </ListItemIcon>
          Owed to You
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect("youOwe")}
          selected={balanceFilter === "youOwe"}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "error.main",
              }}
            />
          </ListItemIcon>
          You Owe
        </MenuItem>
        <MenuItem
          onClick={() => handleFilterSelect("settled")}
          selected={balanceFilter === "settled"}
        >
          <ListItemIcon>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "text.disabled",
              }}
            />
          </ListItemIcon>
          Settled Up
        </MenuItem>
      </Menu>
    </>
  )
}
