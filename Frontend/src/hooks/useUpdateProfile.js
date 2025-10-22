import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileAPI } from '../api/userService';
import { toast } from 'sonner';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], (oldData) => ({
        ...oldData,
        user: data.user,
      }));
      
      toast.success(data.message || "Profile updated successfully!");
      
      // Invalidate the query to ensure data is perfectly fresh in the background.
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    },
  });

  return { updateProfile, isUpdatingProfile };
};