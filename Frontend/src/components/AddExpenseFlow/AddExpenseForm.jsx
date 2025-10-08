import React, { useState, useMemo, useEffect, useCallback } from "react"
import {
  Box,
  Card,
  CardContent,
  IconButton,
  MobileStepper,
  Typography,
  Button,
} from "@mui/material"
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import { AnimatePresence, motion } from "framer-motion"

import { useExpenseForm } from "./useExpenseForm"
import { AmountStep } from "./steps/AmountStep"
import { CategoryStep } from "./steps/CategoryStep"
import { NotesStep } from "./steps/NotesStep"
import { DateStep } from "./steps/DateStep"
import { ShareStep } from "./steps/ShareStep"
import { ContactsStep } from "./steps/ContactsStep"
import { SplitStep } from "./steps/SplitStep"
import { ConfirmStep } from "./steps/ConfirmStep"
import { LockedExpenseStep } from "./steps/LockedExpenseStep"
import { AddContactModal } from "../auth/AddContactModal" // UPDATED: Import the modal here

import { useCreateExpense } from "../../hooks/useCreateExpense"
import { useUpdateExpense } from "../../hooks/useUpdateExpense"

export const AddExpenseForm = ({ expenseToEdit, onClose }) => {
  const { formData, updateFormData, clearFormData } =
    useExpenseForm(expenseToEdit)
  const {
    createExpense,
    isCreating,
    isSuccess,
    reset: resetCreateExpense,
  } = useCreateExpense()
  const {
    updateExpense,
    isUpdating,
    isSuccess: isUpdateSuccess,
  } = useUpdateExpense()

  const [activeStep, setActiveStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [isAddContactModalOpen, setAddContactModalOpen] = useState(false) // UPDATED: State is now lifted here

  const isEditMode = !!expenseToEdit
  const isLocked =
    isEditMode && ["Debt Repayment", "Loan Given"].includes(formData.category)

  const steps = useMemo(() => {
    if (isLocked) return [LockedExpenseStep]
    const baseSteps = [AmountStep, CategoryStep, NotesStep, DateStep, ShareStep]
    if (formData.isShared === true)
      return [...baseSteps, ContactsStep, SplitStep, ConfirmStep]
    if (formData.isShared === false) return [...baseSteps, ConfirmStep]
    return baseSteps
  }, [formData.isShared, isLocked])

  const isStepComplete = () => {
    switch (activeStep) {
      case 0:
        return formData.amount && parseFloat(formData.amount) > 0
      case 1:
        return !!formData.category
      case 4:
        return formData.isShared !== null
      default:
        return true
    }
  }

  const handleNext = () => {
    if (!isStepComplete()) return
    setDirection(1)
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setDirection(-1)
    setActiveStep((prev) => Math.max(prev - 1, 0))
  }

  const handleShareSelect = (isShared) => {
    updateFormData({ isShared })
    handleNext()
  }

  const handleCancel = useCallback(() => {
    clearFormData()
    setActiveStep(0)
    resetCreateExpense()
    if (onClose) onClose()
  }, [clearFormData, onClose, resetCreateExpense])

  const handleEnterPress = () => {
    if (!isStepComplete() || activeStep === steps.length - 1) return
    handleNext()
  }

  const handleSubmit = () => {
    const finalIsSplit = formData.isShared && formData.contacts.length > 0
    const expenseData = {
      totalAmount: parseFloat(formData.amount),
      personalShare: finalIsSplit
        ? formData.splits.find((s) => s.participantId === "user")?.amount || 0
        : parseFloat(formData.amount),
      category: formData.category,
      notes: formData.notes.trim(),
      date: formData.date,
      isSplit: finalIsSplit,
      splitDetails: finalIsSplit
        ? formData.contacts.map((contact) => ({
            person: contact.name,
            amountOwed:
              formData.splits.find((s) => s.participantId === contact._id)
                ?.amount || 0,
          }))
        : [],
    }
    if (formData._id) {
      updateExpense({ expenseId: formData._id, expenseData })
    } else {
      createExpense(expenseData)
    }
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (activeStep < steps.length - 1) {
      if (!isStepComplete()) return
      handleNext()
    } else {
      handleSubmit()
    }
  }

  useEffect(() => {
    if (isSuccess || isUpdateSuccess) {
      handleCancel()
    }
  }, [isSuccess, isUpdateSuccess, handleCancel])

  const CurrentStepComponent = steps[activeStep]

return (
  <>
      <Card sx={{ display: "flex", flexDirection: "column" }}>
        <Box component="form" onSubmit={handleFormSubmit}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <IconButton onClick={handleBack} disabled={activeStep === 0}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              {activeStep === 0 ? (
                <Typography variant="h6" component="div">
                  {isEditMode ? "Edit Expense" : "Add New Expense"}
                </Typography>
              ) : (
                <Button color="error" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </Box>
            <IconButton
              type="submit"
              disabled={!isStepComplete() || activeStep === steps.length - 1}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
          <CardContent sx={{ position: "relative", overflow: "hidden" }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeStep}
              custom={direction}
              initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 0 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 250,
                  }}
                >
                  {CurrentStepComponent && (
                    <CurrentStepComponent
                      formData={formData}
                      updateFormData={updateFormData}
                      onSelect={handleShareSelect}
                      onSubmit={handleSubmit}
                      isCreating={isCreating || isUpdating}
                      onEnterPress={handleEnterPress}
                      isEditMode={isEditMode}
                      onAddNewContact={() => setAddContactModalOpen(true)} // UPDATED: Pass the handler down
                    />
                  )}
                </Box>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <MobileStepper
            variant="dots"
            steps={steps.length}
            position="static"
            activeStep={activeStep}
            sx={{ flexGrow: 0, justifyContent: "center", pb: 2 }}
          />
        </Box>
      </Card>

      {/* UPDATED: The Modal is now a sibling to the Card */}
      <AddContactModal
        open={isAddContactModalOpen}
        onClose={() => setAddContactModalOpen(false)}
      />
    </>
  )
}
