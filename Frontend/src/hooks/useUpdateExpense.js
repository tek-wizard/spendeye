import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateExpenseAPI } from '../api/expenseService';
import { toast } from 'sonner';

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  const {
    mutate,
    isPending,
    isSuccess,
    error
  } = useMutation({
    mutationFn: updateExpenseAPI,
    onSuccess: () => {
      toast.success("Expense updated successfully!");
      
      // After an update, refetch all data that could have changed
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update expense');
    },
  });

  return {
    updateExpense: mutate,
    isUpdating: isPending,
    isSuccess,
    error,
  };
};