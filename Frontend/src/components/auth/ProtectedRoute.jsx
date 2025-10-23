import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// THE FIX: Import the original useAuth hook (assuming you kept the structure intact)
import { useAuth } from '../../hooks/useAuth'; 
import { Box, CircularProgress, Typography } from '@mui/material';

export const ProtectedRoute = () => {
  // THE FIX: Destructure the new isError state
  const { isAuthenticated, isLoading, isError } = useAuth(); 

  if (isLoading) {
    // Show a full-page loader ONLY while verifying.
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // THE FIX: If the verification failed (server down/unauthorized), redirect to auth.
  if (isError && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // If authenticated, render the children.
  // If not authenticated, the isAuthenticated check handles the redirection.
  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
};