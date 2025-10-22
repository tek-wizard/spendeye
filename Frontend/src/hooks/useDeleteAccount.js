import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteAccountAPI } from '../api/authService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: deleteAccount, isPending: isDeletingAccount } = useMutation({
    mutationFn: deleteAccountAPI,
    onSuccess: (data) => {
      // Remove all cached data from the application
      queryClient.removeQueries();
      // Redirect to the login page
      navigate('/auth');
      toast.success(data.message || "Your account has been deleted.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete account.");
    },
  });

  return { deleteAccount, isDeletingAccount };
};