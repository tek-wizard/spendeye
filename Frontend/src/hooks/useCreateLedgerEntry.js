import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLedgerEntryAPI } from '../api/ledgerService';
import { toast } from 'sonner';

export const useCreateLedgerEntry = (options) => { 
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isError,
    error,
    isSuccess,
    reset 
  } = useMutation({
    mutationFn: createLedgerEntryAPI,
    onSuccess: (data) => {
      toast.success(data.message || "Ledger entry created!");
      
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] }); 
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerPeople'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerHistory'] });

      options?.onSuccess?.(data); 
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || 'Failed to create ledger entry');
      options?.onError?.(err);
    },
    ...options 
  });

  return {
    createLedgerEntry: mutate,
    isCreating: isPending,
    isError,
    error,
    isSuccess,
    reset
  };
};