import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settleDebtsAPI } from '../api/ledgerService';
import { toast } from 'sonner';

export const useSettleDebts = () => {
  const queryClient = useQueryClient();

  const { 
    mutate, 
    isPending, 
    isError, 
    error, 
    isSuccess 
  } = useMutation({
    mutationFn: settleDebtsAPI,
    onSuccess: (data) => {
      toast.success(data.message || "Debts settled successfully!");
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] }); 
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to settle debts');
    },
  });

  return { 
    settleDebts: mutate, 
    isSettling: isPending, 
    isError, 
    error, 
    isSuccess 
  };
};

//DELETE