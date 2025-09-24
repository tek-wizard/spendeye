// src/pages/AuthPage.jsx

import React, { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Typography,
  Paper,
  Link,
  Divider,
  Button,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@mui/material/styles"

// Forms
import { SignupForm } from "../components/auth/SignupForm"
import { LoginForm } from "../components/auth/LoginForm"

// Icons
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined"
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined"
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined"
import GoogleIcon from "@mui/icons-material/Google" // For Social Login button

const features = [
  {
    icon: <AssessmentOutlinedIcon sx={{ fontSize: 80 }} />,
    title: "Visualize Your Spending",
    description:
      "See a complete breakdown of your spending with interactive donut charts. Click any category to instantly filter your transactions.",
  },
  {
    icon: <HandshakeOutlinedIcon sx={{ fontSize: 80 }} />,
    title: "Manage Debts Simply",
    description:
      "Never lose track of IOUs. Settle debts and send friendly SMS reminders directly from your ledger snapshot.",
  },
  {
    icon: <AddCircleOutlineOutlinedIcon sx={{ fontSize: 80 }} />,
    title: "Effortless Expense Entry",
    description:
      "Our step-by-step form lets you add detailed expenses, split bills with contacts, and confirm everything before saving.",
  },
]

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
}

export const AuthPage = () => {
  const theme = useTheme()
  const [authType, setAuthType] = useState("signup")
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 4000) // Change feature every 4 seconds
    return () => clearInterval(timer)
  }, [])

  // Apply the animated background class to the root Grid container
  return (
    <Grid container sx={{ minHeight: "100vh" }} className="auth-background">
      {/* 1. The Floating Showcase Panel (Left Side) */}
      <Grid
        item
        size={{ md: 6 }}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 8,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: 0.2, duration: 0.5 },
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{ textAlign: "center" }}
          >
            <Box sx={{ color: "primary.main", mb: 3 }}>
              {features[activeFeature].icon}
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 1,
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              }}
            >
              {features[activeFeature].title}
            </Typography>
            <Typography
              variant="h5"
            >
              {features[activeFeature].description}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Grid>

      {/* 2. The "Frosted Glass" Form Panel (Right Side) */}
      <Grid
        item
        size={{ xs: 12, md: 6 }}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // Mobile view has a subtle dark overlay
          bgcolor: { xs: "rgba(0,0,0,0.2)", md: "transparent" },
        }}
      >
        <Box
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            // The Glassmorphism effect
            bgcolor: "rgba(30, 30, 46, 0.6)", // Semi-transparent card color
            backdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.125)",
            borderRadius: 4,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={authType}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {authType === "signup" ? (
                <SignupForm onToggle={() => setAuthType("login")} />
              ) : (
                <LoginForm onToggle={() => setAuthType("signup")} />
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AuthPage
