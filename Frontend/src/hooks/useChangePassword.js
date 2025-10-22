import { useMutation } from '@tanstack/react-query';
import { changePasswordAPI } from '../api/authService';
import { toast } from 'sonner';

export const useChangePassword = () => {
  const { mutate: changePassword, isPending: isChangingPassword } = useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: (data) => {
      toast.success(data.message || "Password changed successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to change password.");
    },
  });

  return { changePassword, isChangingPassword };
};