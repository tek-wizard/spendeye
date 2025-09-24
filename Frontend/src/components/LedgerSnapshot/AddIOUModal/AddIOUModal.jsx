// import React, { useState, useRef, useEffect,useCallback } from "react"; // Import useEffect
// import {
//   Dialog, DialogContent, Box, IconButton, DialogActions, Button,
//   LinearProgress, Typography, CircularProgress
// } from "@mui/material";
// import { AnimatePresence, motion } from "framer-motion";
// import { useTheme } from "@mui/material/styles";
// import { darken } from "@mui/material/styles";

// // Icons
// import CloseIcon from "@mui/icons-material/Close";
// import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";

// // Import Steps
// import { SelectContactStep } from "./steps/SelectContactStep";
// import { ConfirmIOUStep } from "./steps/ConfirmIOUStep";
// import { IOUNotesStep } from "./steps/IOUNotesStep";
// import { IOUAmountStep } from "./steps/IOUAmountStep";
// import { IOUDateStep } from "./steps/IOUDateStep";

// // Import the hook to connect to the API
// import { useCreateIOU } from "../../../hooks/useCreateIOU";

// const initialFormData = {
//   contact: null,
//   amount: "",
//   notes: "",
//   date: new Date(),
// };

// export const AddIOUModal = ({ open, onClose }) => {
//   const theme = useTheme();
//   const formRef = useRef(null);
//   const [activeStep, setActiveStep] = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [formData, setFormData] = useState(initialFormData);
//   const { createIOU, isCreatingIOU, isSuccess,reset } = useCreateIOU();

//   const updateFormData = (newData) => setFormData((prev) => ({ ...prev, ...newData }));
//   const handleNext = () => { setDirection(1); setActiveStep((prev) => prev + 1) };
//   const handleBack = () => { setDirection(-1); setActiveStep((prev) => prev - 1) };
//   const handleSelectContact = (contact) => { updateFormData({ contact }); handleNext() };

//   const handleCloseModal = useCallback(() => {
//     setFormData(initialFormData);
//     setActiveStep(0);
//     reset();
//     onClose();
//   }, [onClose, reset]);

//   // This effect runs after a successful API call
//   useEffect(() => {
//     if (isSuccess) {
//     handleCloseModal();
//     }
// }, [isSuccess, handleCloseModal]);

// const handleSubmit = () => {
//   const iouData = {
//     person: formData.contact.name,
//     amount: parseFloat(formData.amount),
//     type: "Borrowed",
//     notes: formData.notes.trim(),
//     date: formData.date,
//   };
//   // The hook now handles the toast and data refetching on its own
//   createIOU(iouData);
// };

//   const handleFormSubmit = (event) => {
//     event.preventDefault();
//     if (activeStep < steps.length - 1) {
//       if (!isNextDisabled()) { handleNext(); }
//     } else {
//       handleSubmit();
//     }
//   };

//   const handleEnterPress = () => {
//     if (formRef.current) {
//       formRef.current.dispatchEvent(
//         new Event("submit", { cancelable: true, bubbles: true })
//       )
//     }
//   }

//   const steps = [
//     <SelectContactStep onSelect={handleSelectContact} />,
//     <IOUAmountStep formData={formData} updateFormData={updateFormData} onEnterPress={handleEnterPress} />,
//     <IOUNotesStep
//       formData={formData}
//       updateFormData={updateFormData}
//       onEnterPress={handleEnterPress}
//     />,
//     <IOUDateStep
//       formData={formData}
//       updateFormData={updateFormData}
//       onEnterPress={handleEnterPress}
//     />,
//     <ConfirmIOUStep formData={formData} />,
// ];

//   const isNextDisabled = () => {
//     // FIX: Added a check for the first step (index 0)
//     if (activeStep === 0 && !formData.contact) {
//       return true // Disable if on step 0 and no contact is selected
//     }
//     if (
//       activeStep === 1 &&
//       (!formData.amount || parseFloat(formData.amount) <= 0)
//     ) {
//       return true
//     }
//     return false
//   }

//   const progress = ((activeStep + 1) / steps.length) * 100

//   return (
//     <Dialog
//       open={open}
//       onClose={handleCloseModal}
//       fullWidth
//       maxWidth="sm"
//       slotProps={{
//         paper: {
//           sx: {
//             background: `linear-gradient(180deg, ${
//               theme.palette.background.paper
//             } 0%, ${darken(theme.palette.background.paper, 0.15)} 100%)`,
//             borderRadius: 4,
//           },
//         },
//       }}
//     >
//       <LinearProgress variant="determinate" value={progress} />

//       <IconButton
//         onClick={handleCloseModal}
//         sx={{ position: "absolute", right: 16, top: 16, zIndex: 1 }}
//       >
//         <CloseIcon />
//       </IconButton>

//       {/* This form wrapper enables the "Enter" key functionality */}
//       <Box component="form" onSubmit={handleFormSubmit} ref={formRef}>
//         <DialogContent
//           sx={{
//             position: "relative",
//             minHeight: 400,
//             overflow: "hidden",
//             p: 3,
//             display: "flex",
//             flexDirection: "column",
//           }}
//         >
//           <Box sx={{ textAlign: "center", mb: 2 }}>
//             <Box
//               sx={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: 64,
//                 height: 64,
//                 borderRadius: "50%",
//                 bgcolor: "secondary.main",
//                 mb: 1,
//               }}
//             >
//               <HandshakeOutlinedIcon
//                 sx={{ fontSize: 32, color: "text.primary" }}
//               />
//             </Box>
//           </Box>

//           <AnimatePresence initial={false} custom={direction} mode="wait">
//             <motion.div
//               key={activeStep}
//               custom={direction}
//               initial={{ x: direction > 0 ? "50px" : "-50px", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: direction > 0 ? "-50px" : "50px", opacity: 0 }}
//               transition={{ type: "tween", ease: "easeInOut", duration: 0.25 }}
//               // This style ensures the step content is always vertically centered
//               style={{
//                 flexGrow: 1,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               {steps[activeStep]}
//             </motion.div>
//           </AnimatePresence>
//         </DialogContent>

//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={handleBack} disabled={activeStep === 0}>
//             Back
//           </Button>
//           {activeStep < steps.length - 1 ? (
//             <Button type="submit" disabled={isNextDisabled()}>
//               Next
//             </Button>
//           ) : (
//             <Button
//     type="submit" // Triggers the form's onSubmit
//     variant="contained"
//     color="primary"
//     disabled={isCreatingIOU} // Uses the correct loading state
// >
//     {isCreatingIOU ? (
//     <CircularProgress size={24} color="inherit" />
//     ) : (
//     "Create IOU"
//     )}
// </Button>
//           )}
//         </DialogActions>
//       </Box>
//     </Dialog>
//   )
// }
