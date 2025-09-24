// src/hooks/useCreateIOU.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createIOUAPI } from '../api/ledgerService';
import { toast } from 'sonner';

export const useCreateIOU = () => {
  const queryClient = useQueryClient();

  const { 
    mutate, 
    isPending, 
    isError, 
    error, 
    isSuccess,
    reset 
  } = useMutation({
    mutationFn: createIOUAPI,
    onSuccess: (data) => {
      toast.success(data.message || "IOU created successfully!");
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create IOU'),
  });

  return { 
    createIOU: mutate, 
    isCreatingIOU: isPending, 
    isError, 
    error, 
    isSuccess,
    reset // FIX: Return the reset function so the component can use it
  };
};

//DELETE