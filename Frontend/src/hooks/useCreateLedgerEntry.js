import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLedgerEntryAPI } from '../api/ledgerService';
import { toast } from 'sonner';

export const useCreateLedgerEntry = () => {
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
      
      // After creating an entry, our summaries are out of date.
      // Invalidate them to trigger an automatic refetch.
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] }); 
      queryClient.invalidateQueries({ queryKey: ['creditors'] });

    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create ledger entry');
    },
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