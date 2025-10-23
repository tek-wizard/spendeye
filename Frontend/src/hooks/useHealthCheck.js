import { useQuery } from '@tanstack/react-query';
import { healthCheckAPI } from '../api/authService';

export const useHealthCheck = () => {
  const { data, isLoading, isSuccess, isError, failureCount, refetch } = useQuery({
    queryKey: ['healthCheck'],
    queryFn: healthCheckAPI,
    // A patient and professional retry strategy
    retry: 20, // Try up to 20 times
    retryDelay: 3000, // Wait 3 seconds between each attempt
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  return { 
    isBackendReady: isSuccess, 
    isCheckingHealth: isLoading,
    isError,
    failureCount, // Expose the number of failed attempts for the UI
    refetchHealthCheck: refetch, // Expose the refetch function for the error state
  };
};