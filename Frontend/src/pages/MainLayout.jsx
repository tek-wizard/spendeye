import React, { useMemo, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import {
  Box,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Typography,
  Tooltip,
} from "@mui/material" // Import Tooltip
import { useAuth } from "../hooks/useAuth"
import { useLogoutUser } from "../hooks/useLogoutUser"

// Component Imports
import { TopNavBar, BottomNavBar, MobileHeader } from "../components/Navigation"

// Icon Imports
import Settings from "@mui/icons-material/Settings"
import Logout from "@mui/icons-material/Logout"

const MainLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { logoutUser } = useLogoutUser()

  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)

  const isSettingsPage = location.pathname.startsWith("/settings")

  const activeTab = useMemo(() => {
    const path = location.pathname
    if (path.startsWith("/expenses")) return "expenses"
    if (path.startsWith("/ledger")) return "ledger"
    if (path.startsWith("/insights")) return "insights"
    if (path.startsWith("/settings")) return "settings"
    return "home"
  }, [location.pathname])

  const handleNavigate = (path) => {
    navigate(path)
    handleMenuClose()
  }

  const handleTitleClick = () => {
    navigate("/")
  }

  const handleLogout = () => {
    handleMenuClose()
    logoutUser()
  }

  return (
    <Box className="bg-black min-h-screen text-gray-50">
      <TopNavBar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onAvatarClick={handleMenuOpen}
        isSettingsPage={isSettingsPage}
      />
      <MobileHeader
        onAvatarClick={handleMenuOpen}
        onTitleClick={handleTitleClick}
        isSettingsPage={isSettingsPage}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 md:pt-24 md:pb-8">
        <Outlet />
      </main>

      <BottomNavBar
        activeTab={activeTab}
        onTabChange={(tab) => handleNavigate(tab === "home" ? "/" : `/${tab}`)}
      />

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            bgcolor: "background.paper",
            width: 220,
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem disabled sx={{ opacity: "1 !important" }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body1"
              color="text.primary"
              sx={{
                fontWeight: "bold",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: 180,
              }}
            >
              {user?.username}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "block",
                maxWidth: 180,
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />

        <MenuItem onClick={() => handleNavigate("/settings")}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon>
            <Logout fontSize="small" sx={{ color: "error.main" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default MainLayout
