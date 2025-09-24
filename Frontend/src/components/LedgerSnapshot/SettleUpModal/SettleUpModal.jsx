import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  DialogActions,
  Button,
  LinearProgress,
  CircularProgress,
} from "@mui/material"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "@mui/material/styles"
import { darken } from "@mui/material/styles"
import { useSettleDebts } from "../../../hooks/useSettleDebts"

// Icons
import CloseIcon from "@mui/icons-material/Close"
import PaymentIcon from "@mui/icons-material/Payment"

import { SelectCreditorsStep } from "./SelectCreditorsStep"
import { ConfirmSettlementStep } from "./ConfirmSettlementStep"

export const SettleUpModal = ({ open, onClose, creditors, isLoading }) => {
  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [selectedContacts, setSelectedContacts] = useState([])

  // FIX: Use the correct, descriptive variable names from our hook
  const { settleDebts, isSettling } = useSettleDebts()

  const toggleContact = (contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.id === contact.id)
        ? prev.filter((c) => c.id !== contact.id)
        : [...prev, contact]
    )
  }

  const handleNext = () => {
    setDirection(1)
    setActiveStep(1)
  }
  const handleBack = () => {
    setDirection(-1)
    setActiveStep(0)
  }

  const handleSettleUp = () => {
    const settlementData = {
      listOfExpenses: selectedContacts.map((contact) => ({
        name: contact.name,
        amount: contact.amount,
        notes: `Debt repayment to ${contact.name}`,
        date: new Date(),
      })),
    }
    settleDebts(settlementData, {
      onSuccess: () => handleCloseModal(),
    })
  }

  const handleCloseModal = () => {
    setSelectedContacts([])
    setActiveStep(0)
    onClose()
  }

  const steps = [
    <SelectCreditorsStep
      creditors={creditors}
      selectedContacts={selectedContacts}
      toggleContact={toggleContact}
      isLoading={isLoading}
    />,
    <ConfirmSettlementStep selectedContacts={selectedContacts} />,
  ]

  const progress = ((activeStep + 1) / steps.length) * 100

  // FIX: Removed the incorrect Skeleton check from here.
  // The loading state is now correctly handled inside the SelectCreditorsStep.

  return (
    <Dialog
      open={open}
      onClose={handleCloseModal}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: `linear-gradient(180deg, ${
            theme.palette.background.paper
          } 0%, ${darken(theme.palette.background.paper, 0.15)} 100%)`,
          borderRadius: 4,
        },
      }}
    >
      <LinearProgress variant="determinate" value={progress} />
      <IconButton
        onClick={handleCloseModal}
        sx={{ position: "absolute", right: 16, top: 16, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent
        sx={{
          position: "relative",
          minHeight: 400,
          overflow: "hidden",
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "secondary.main",
              mb: 1,
            }}
          >
            <PaymentIcon sx={{ fontSize: 32, color: "text.primary" }} />
          </Box>
        </Box>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeStep}
            custom={direction}
            initial={{ x: direction > 0 ? "50px" : "-50px", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? "-50px" : "50px", opacity: 0 }}
            transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
            style={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {steps[activeStep]}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        {activeStep === 0 ? (
          <Button onClick={handleNext} disabled={selectedContacts.length === 0}>
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSettleUp}
            disabled={isSettling}
          >
            {isSettling ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm & Settle"
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
