// src/components/common/AddContactModal.jsx

import React, { useEffect, useCallback } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Stack, CircularProgress, Box
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema } from "../auth/auth.schema";
import { useAddContact } from "../../hooks/useAddContact";

export const AddContactModal = ({ open, onClose, onContactCreated }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const {
    addContact,
    isAddingContact,
    isSuccess,
    reset: resetMutation,
  } = useAddContact();

  const onSubmit = (data) => {
    addContact(data, {
      onSuccess: (responseData) => {
        if (onContactCreated && responseData.addedContact) {
          onContactCreated(responseData.addedContact);
        }
      }
    });
  };
  
  const handleClose = useCallback(() => {
    reset();
    resetMutation();
    onClose();
  }, [onClose, reset, resetMutation]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  return (
     <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      {/* The form submit is now only triggered by its own button's onClick */}
      <Box component="form" onSubmit={(e) => e.preventDefault()}>
        <DialogTitle sx={{ fontWeight: "bold" }}>Add New Contact</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Contact Name"
              {...register("contactName")}
              error={!!errors.contactName}
              helperText={errors.contactName?.message}
              autoFocus
            />
            <TextField
              label="Phone Number (Optional)"
              type="tel"
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={
                errors.phoneNumber
                  ? errors.phoneNumber.message
                  : "Optional: can be edited later"
              }
            />
         </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            // THE FIX IS HERE
            type="button" // Change from "submit" to "button"
            onClick={handleSubmit(onSubmit)} // Trigger the submit handler manually
            variant="contained"
            disabled={isAddingContact}
          >
            {isAddingContact ? <CircularProgress size={24} /> : "Save Contact"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};