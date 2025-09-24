import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addContactAPI } from '../api/userService';
import { toast } from 'sonner';

export const useAddContact = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isSuccess,
    reset
  } = useMutation({
    mutationFn: addContactAPI,
    onSuccess: (data) => {
      toast.success(data.message || "Contact added successfully!");
      // This is the key: it automatically refreshes the list in the background
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to add contact');
    },
  });

  return { 
    addContact: mutate, 
    isAddingContact: isPending, 
    isSuccess,
    reset 
  };
};