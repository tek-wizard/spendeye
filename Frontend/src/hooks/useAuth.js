import { useQuery } from '@tanstack/react-query';
import { verifyUserAPI } from '../api/authService';

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: verifyUserAPI,
    retry: false, // Don't retry if the user is unauthenticated
    refetchOnWindowFocus: false,
  });

  return { 
    user: data?.user, 
    isAuthenticated: !!data?.user && !isError,
    isLoading,
  };
};