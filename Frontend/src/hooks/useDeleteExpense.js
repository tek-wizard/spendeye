import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExpenseAPI } from '../api/expenseService';
import { toast } from 'sonner';

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteExpenseAPI,
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      // After a deletion, all our summary data is stale. Refetch everything.
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete expense');
    },
  });

  return { 
    deleteExpense: mutate, 
    isDeleting: isPending, 
  };
};