import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExpenseAPI } from '../api/expenseService';
import { toast } from 'sonner';

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  const { 
    mutate, 
    isPending, 
    isError, 
    error, 
    isSuccess,
    reset
} = useMutation({
    mutationFn: createExpenseAPI,
    onSuccess: () => {
      toast.success("Expense created successfully!");
      // This is the master command to refetch all stale data
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] }); 
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create expense'),
  });

  return { 
    createExpense: mutate, 
    isCreating: isPending, 
    isError, 
    error, 
    isSuccess,
    reset
  };
};