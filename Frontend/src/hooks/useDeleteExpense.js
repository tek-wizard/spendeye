import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteExpenseAPI } from '../api/expenseService';
import { toast } from 'sonner';

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteExpenseAPI,
    onSuccess: () => {
      toast.success("Expense deleted successfully!");
      
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerSummary'] });
      queryClient.invalidateQueries({ queryKey: ['debtors'] });
      queryClient.invalidateQueries({ queryKey: ['creditors'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerPeople'] });
      queryClient.invalidateQueries({ queryKey: ['ledgerHistory'] });
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