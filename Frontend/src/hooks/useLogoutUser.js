import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUserAPI } from '../api/authService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useLogoutUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: logoutUser, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutUserAPI,
    onSuccess: () => {
      // Remove all cached user data
      queryClient.removeQueries();
      navigate('/auth');
      toast.success("You've been logged out.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Logout failed.");
    },
  });

  return { logoutUser, isLoggingOut };
};