// src/pages/AuthPage.jsx

import React, { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Typography,
} from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@mui/material/styles"

// Forms
import { SignupForm } from "../components/auth/SignupForm"
import { LoginForm } from "../components/auth/LoginForm"

// Icons
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined"
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined"
import SpaceDashboardOutlinedIcon from "@mui/icons-material/SpaceDashboardOutlined"

const features = [
  {
    icon: <ForumOutlinedIcon sx={{ fontSize: 80 }} />,
    title: "A Financial Conversation",
    description:
      "Transform your ledger into an intuitive, chat-style history. Track money lent and borrowed with an aesthetic and professional interface that feels like a conversation.",
  },
  {
    icon: <InsightsOutlinedIcon sx={{ fontSize: 80 }} />,
    title: "Your Monthly Story",
    description:
      "Go beyond data with an AI-generated summary of your financial month. Discover patterns with a beautiful heatmap calendar and get key insights at a glance.",
  },
  {
    icon: <SpaceDashboardOutlinedIcon sx={{ fontSize: 80 }} />,
    title: "Your Expense Command Center",
    description:
      "Analyze your spending with a professional three-column dashboard. Utilize powerful, real-time filters and sticky summary charts for a complete overview.",
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
    }, 6000)
    return () => clearInterval(timer)
  }, [])

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
            <Typography variant="h5">
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
          bgcolor: { xs: "rgba(0,0,0,0.2)", md: "transparent" },
        }}
      >
        <Box
          sx={{
            p: { xs: 3, sm: 4 },
            width: "90%",
            maxWidth: { xs: 350, sm: 400, md: 420 },
            bgcolor: "rgba(30, 30, 46, 0.6)",
            backdropFilter: "blur(16px) saturate(180%)",
            border: "1px solid",
            borderColor: "rgba(255, 255, 255, 0.125)",
            borderRadius: { xs: 2, sm: 3, md: 4 },
            mx: "auto",
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
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
