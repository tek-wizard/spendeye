import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateBudgetAPI } from '../api/userService';
import { toast } from 'sonner';

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  const { mutate: updateBudget, isPending: isUpdatingBudget } = useMutation({
    mutationFn: updateBudgetAPI,
    onSuccess: (data) => {
      toast.success(data.message || "Budget updated successfully!");
      // Invalidate the 'user' query to refetch the latest user data, including the new budget
      queryClient.invalidateQueries({ queryKey: ['user'] });
      // Also invalidate dashboard summary, as it uses the budget
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update budget.");
    },
  });

  return { updateBudget, isUpdatingBudget };
};