import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, Box, IconButton, DialogActions, Button } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Steps
import { SelectRecipientsStep } from './SelectRecipientsStep';
import { ComposeMessagesStep } from './ComposeMessagesStep';

const generateDefaultMessage = (contact) => 
  `Hi ${contact.name}, this is a friendly reminder regarding the outstanding amount of ₹${contact.amount.toFixed(2)}. Thanks!`;

export const RemindModal = ({ open, onClose, debtors, onSendReminders }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [messages, setMessages] = useState({});

  // Effect to generate default messages when the user proceeds to the next step
  useEffect(() => {
    if (activeStep === 1) {
      const defaultMessages = {};
      selectedContacts.forEach(contact => {
        defaultMessages[contact.id] = generateDefaultMessage(contact);
      });
      setMessages(defaultMessages);
    }
  }, [activeStep, selectedContacts]);

  const handleNext = () => {
    setDirection(1);
    setActiveStep(1);
  };
  const handleBack = () => {
    setDirection(-1);
    setActiveStep(0);
  };

  const toggleContact = (contact) => {
    setSelectedContacts((prev) =>
      prev.some(c => c.id === contact.id)
        ? prev.filter((c) => c.id !== contact.id)
        : [...prev, contact]
    );
  };

  const handleMessageChange = (contactId, text) => {
    setMessages(prev => ({ ...prev, [contactId]: text }));
  };
  
  const handleResetMessage = (contact) => {
    setMessages(prev => ({ ...prev, [contact.id]: generateDefaultMessage(contact) }));
  };

  const handleClearMessage = (contactId) => {
    setMessages(prev => ({ ...prev, [contactId]: '' }));
  };

  const handleRemoveRecipient = (contactToRemove) => {
    setSelectedContacts(prev => prev.filter(c => c.id !== contactToRemove.id));
    // Also remove their message from the state
    setMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[contactToRemove.id];
        return newMessages;
    });
  };

  const handleSend = () => {
    // Pass the final list of contacts and their messages to the parent
    const remindersToSend = selectedContacts.map(contact => ({
        ...contact,
        message: messages[contact.id]
    }));
    onSendReminders(remindersToSend);
    handleCloseModal(); // Close after sending
  };
  
  const handleCloseModal = () => {
      setSelectedContacts([]);
      setMessages({});
      setActiveStep(0);
      onClose();
  };
  
  const isNextDisabled = selectedContacts.length === 0;
  const isSendDisabled = Object.values(messages).some(msg => msg.trim() === '') || selectedContacts.length === 0;

  const steps = [
    <SelectRecipientsStep debtors={debtors} selectedContacts={selectedContacts} toggleContact={toggleContact} />,
    <ComposeMessagesStep selectedContacts={selectedContacts} messages={messages} onMessageChange={handleMessageChange} onReset={handleResetMessage} onClear={handleClearMessage} onRemove={handleRemoveRecipient} />
  ];

  return (
    <Dialog open={open} onClose={handleCloseModal} fullWidth maxWidth="sm">
       <DialogContent sx={{ position: 'relative', minHeight: 400, overflow: 'hidden', pt: 5, px: 3, pb: 3 }}>
        <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}><CloseIcon /></IconButton>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeStep}
            custom={direction}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            style={{ height: '100%' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              {steps[activeStep]}
            </Box>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleBack} disabled={activeStep === 0} startIcon={<ArrowBackIosNewIcon />}>Back</Button>
        {activeStep === 0 ? (
          <Button onClick={handleNext} disabled={isNextDisabled} endIcon={<ArrowForwardIosIcon />}>Next</Button>
        ) : (
          <Button variant="contained" onClick={handleSend} disabled={isSendDisabled}>Send Reminders</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};