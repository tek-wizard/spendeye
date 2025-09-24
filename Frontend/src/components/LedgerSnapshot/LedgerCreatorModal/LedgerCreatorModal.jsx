import React, { useState, useRef, useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  DialogActions,
  Button,
  LinearProgress,
  Typography,
  CircularProgress,
} from "@mui/material"
import { AnimatePresence, motion } from "framer-motion"
import { useTheme } from "@mui/material/styles"
import { darken } from "@mui/material/styles"

// Icons
import CloseIcon from "@mui/icons-material/Close"
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong" // A more generic icon for 'Ledger'

// Import all the new, dedicated steps for this flow
import { SelectTypeStep } from "./steps/SelectTypeStep"
import { SelectContactStep } from "./steps/SelectContactStep"
import { LedgerAmountStep } from "./steps/LedgerAmountStep"
import { LedgerNotesStep } from "./steps/LedgerNotesStep"
import { LedgerDateStep } from "./steps/LedgerDateStep"
import { ConfirmLedgerStep } from "./steps/ConfirmLedgerStep"

import { AddContactModal } from "../../auth/AddContactModal"
import { NotificationModal } from '../../NotificationModal';

// Import the hook to connect to the API
import { useCreateLedgerEntry } from "../../../hooks/useCreateLedgerEntry"

const initialFormData = {
  type: null,
  contact: null,
  amount: "",
  notes: "",
  date: new Date(),
}

export const LedgerCreatorModal = ({ open, onClose }) => {
  const theme = useTheme()
  const formRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [notification, setNotification] = useState({ open: false, title: '', message: '', items: [] });

  const [isAddContactModalOpen, setAddContactModalOpen] = useState(false)

  const { createLedgerEntry, isCreating, isSuccess, reset } = useCreateLedgerEntry()

  const handleNext = () => {
    setDirection(1)
    setActiveStep((prev) => prev + 1)
  }
  const handleBack = () => {
    setDirection(-1)
    setActiveStep((prev) => prev - 1)
  }

  const updateFormData = (newData) =>
    setFormData((prev) => ({ ...prev, ...newData }))

  const handleTypeSelect = (type) => {
    updateFormData({ type ,notes:""})
    handleNext()
  }
  const handleContactSelect = (contact) => {
    let defaultNote = '';
    switch (formData.type) {
      case 'Lent':
        defaultNote = `Loan given to ${contact.name}`;
        break;
      case 'Borrowed':
        defaultNote = `Loan borrowed from ${contact.name}`;
        break;
      case 'Paid Back':
        defaultNote = `Debt settlement to ${contact.name}`;
        break;
      case 'Got Back':
        defaultNote = `Debt collected from ${contact.name}`;
        break;
      default:
        break;
    }
    updateFormData({ contact, notes: defaultNote });
    handleNext();
};

  const handleCloseModal = useCallback(() => {
    setFormData(initialFormData)
    setActiveStep(0)
    reset()
    onClose()
  }, [onClose, reset])

  useEffect(() => {
    if (isSuccess) handleCloseModal()
  }, [isSuccess, handleCloseModal])

  useEffect(() => {
    if (
      activeStep === 3 &&
      formData.type &&
      formData.contact &&
      !formData.notes
    ) {
      const defaultNote = `${formData.type} transaction with ${formData.contact.name}`
      updateFormData({ notes: defaultNote })
    }
  }, [activeStep, formData.type, formData.contact])

  const handleNewContactSuccess = (newContact) => {
    const normalizedContact = { ...newContact, id: newContact._id };
    handleContactSelect(normalizedContact);
  };

  const handleSubmit = () => {
    const ledgerEntryData = {
      person: formData.contact.name,
      amount: parseFloat(formData.amount),
      type: formData.type,
      notes: formData.notes.trim(),
      date: formData.date,
    }
    createLedgerEntry(ledgerEntryData, {
      onSuccess: (data) => {
        const expenses = data.createdExpenses || [];
        const ledgers = data.createdLedgers || [];
        
        // ONLY show the modal if more than one item was created
        if (expenses.length > 1 || ledgers.length > 1) {
          setNotification({
            open: true,
            title: 'Transaction Processed!',
            message: 'Your payment was automatically split into the following entries for accuracy:',
            items: expenses.length > 1 ? expenses : ledgers.map(l => ({ ...l, totalAmount: l.amount, category: l.type })),
          });
        }
    }
    });
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (activeStep < steps.length - 1) {
      if (!isNextDisabled()) {
        handleNext()
      }
    } else {
      handleSubmit()
    }
  }

  const handleEnterPress = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      )
    }
  }

  const steps = [
    <SelectTypeStep onSelect={handleTypeSelect} />,
    <SelectContactStep
      type={formData.type}
      onSelect={handleContactSelect}
      selectedContact={formData.contact}
      onAddNewContact={() => setAddContactModalOpen(true)}
    />,
    <LedgerAmountStep
      formData={formData}
      updateFormData={updateFormData}
      onEnterPress={handleEnterPress}
    />,
    <LedgerNotesStep
      formData={formData}
      updateFormData={updateFormData}
      onEnterPress={handleEnterPress}
    />,
    <LedgerDateStep
      formData={formData}
      updateFormData={updateFormData}
      onEnterPress={handleEnterPress}
    />,
    <ConfirmLedgerStep formData={formData} />,
  ]

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !formData.type
      case 1:
        return !formData.contact
      case 2:
        return !formData.amount || parseFloat(formData.amount) <= 0
      default:
        return false
    }
  }

  const progress = ((activeStep + 1) / steps.length) * 100

  return (
    <>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              background: `linear-gradient(180deg, ${
                theme.palette.background.paper
              } 0%, ${darken(theme.palette.background.paper, 0.15)} 100%)`,
              borderRadius: 4,
            },
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

        <Box component="form" onSubmit={handleFormSubmit} ref={formRef}>
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
                <ReceiptLongIcon sx={{ fontSize: 32, color: "text.primary" }} />
              </Box>
            </Box>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={activeStep}
                custom={direction}
                initial={{ x: "50px", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-50px", opacity: 0 }}
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.25,
                }}
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
            <Button onClick={handleCloseModal} color="error">Cancel</Button>
            <Box sx={{ flexGrow: 1 }} /> {/* Spacer */}
            <Button onClick={handleBack} disabled={activeStep === 0}>Back</Button>
            {activeStep < steps.length - 1 ? (
              <Button type="submit" disabled={isNextDisabled()}>Next</Button>
            ) : (
              <Button type="submit" variant="contained" color="primary" disabled={isCreating}>
                {isCreating ? <CircularProgress size={24} color="inherit" /> : "Create Entry"}
              </Button>
            )}
          </DialogActions>
          
        </Box>
      </Dialog>
      <AddContactModal
        open={isAddContactModalOpen}
        onClose={() => setAddContactModalOpen(false)}
      />
      <NotificationModal 
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        title={notification.title}
        message={notification.message}
        createdItems={notification.items}
    />
    </>
  )
}
