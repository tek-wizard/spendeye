import React, { useState, useCallback, useEffect } from "react" // THE FIX: Import useEffect
import { Paper, Box, Button, Stack, CircularProgress,Typography } from "@mui/material"
import { motion, AnimatePresence } from "framer-motion"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { toast } from 'sonner'

import { useCreateLedgerEntry } from '../../hooks/useCreateLedgerEntry';

import { MetricsSlide } from "./CreatorSlides/MetricsSlide"
import { TypeSlide } from "./CreatorSlides/TypeSlide"
import { ContactSlide } from "./CreatorSlides/ContactSlide"
import { DetailsSlide } from "./CreatorSlides/DetailsSlide"

const panelVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
}

const initialFormState = {
  type: null,
  contact: null,
  amount: "",
  note: "",
  date: new Date(),
}
const slideOrder = ["metrics", "type", "contact", "details"]

export const LedgerCreatorPanel = ({ summaryData, isLoading }) => {
  const [activeSlide, setActiveSlide] = useState("metrics")
  const [direction, setDirection] = useState(1)
  const [formData, setFormData] = useState(initialFormState)

  const { createLedgerEntry, isCreating } = useCreateLedgerEntry();

  useEffect(() => {
    if (activeSlide === 'details' && !formData.date) { 
      setFormData(prev => ({ ...prev, date: new Date() }));
    } else if (activeSlide === 'metrics') { 
        setFormData(prev => ({ ...prev, date: new Date() }));
    }
  }, [activeSlide, formData.date]);


  const navigateTo = (slide) => {
    setDirection(1)
    setActiveSlide(slide)
  }

  const handleBack = () => {
    setDirection(-1)
    const currentIndex = slideOrder.indexOf(activeSlide)
    if (currentIndex > 0) setActiveSlide(slideOrder[currentIndex - 1])
  }

  const handleCancel = useCallback(() => {
    setDirection(-1)
    setActiveSlide("metrics")
    setTimeout(() => setFormData({ ...initialFormState, date: new Date() }), 300) 
  }, [])

  const handleTypeSelect = (type) => {
    setFormData((p) => ({ ...p, type }))
    navigateTo("contact")
  }
  const handleContactSelect = (contact) => {
    setFormData((p) => ({ ...p, contact }))
    navigateTo("details")
  }
  
  const handleCommit = () => {
    if (isCreating) return;

    if (!formData.amount || Number(formData.amount) <= 0) {
        toast.error("Please enter a valid amount.");
        return;
    }

    const ledgerEntryData = {
        person: formData.contact.name,
        amount: parseFloat(formData.amount),
        type: formData.type,
        notes: formData.note.trim(),
        date: formData.date.toISOString(), 
    };

    createLedgerEntry(ledgerEntryData, {
        onSuccess: (data) => {
            handleCancel(); // This will now reset with a fresh date
        },
    });
  }
const renderHeader = () => (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ p: 1, borderBottom: 1, borderColor: "divider", minHeight: 56 }}
    >
      <Box sx={{ minWidth: 120, display: 'flex', alignItems: 'center' }}>
        {activeSlide === 'metrics' ? (
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', pl: 1 }}>
            Ledger Summary
          </Typography>
        ) : activeSlide === "type" ? (
          <Button startIcon={<ArrowBackIosNewIcon />} onClick={handleCancel}>
            Cancel
          </Button>
        ) : (
          <Button startIcon={<ArrowBackIosNewIcon />} onClick={handleBack}>
            Back
          </Button>
        )}
      </Box>
      <Box sx={{ minWidth: 120, display: "flex", justifyContent: "flex-end" }}>
        {activeSlide === "metrics" && (
          <Button
            variant="text"
            endIcon={<ArrowForwardIosIcon fontSize="small" />}
            onClick={() => navigateTo("type")}
            sx={{ textTransform: "none" }}
          >
            Add ledger
          </Button>
        )}
        {activeSlide === "details" && (
          <Button variant="contained" onClick={handleCommit} disabled={isCreating}>
            {isCreating ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
          </Button>
        )}
      </Box>
    </Stack>
  )

  const renderSlide = () => {
    switch (activeSlide) {
      case "metrics":
        return <MetricsSlide summaryData={summaryData} isLoading={isLoading} />
      case "type":
        return <TypeSlide onSelect={handleTypeSelect} />
      case "contact":
        return <ContactSlide onSelect={handleContactSelect} />
      case "details":
        return (
          <DetailsSlide
            formData={formData}
            onAmountChange={(v) => setFormData((p) => ({ ...p, amount: v }))}
            onNoteChange={(v) => setFormData((p) => ({ ...p, note: v }))}
            onDateChange={(date) => setFormData((p) => ({ ...p, date }))}
          />
        )
      default:
        return null
    }
  }

  const containerHeight = activeSlide === "metrics" ? 95 : 335

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2 }}>
      {renderHeader()}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          height: containerHeight,
          transition: "height 0.35s ease-in-out",
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeSlide}
            custom={direction}
            variants={panelVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            style={{ height: "100%" }}
          >
            <Box
              sx={{
                p: 2.5,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {renderSlide()}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Paper>
  )
}