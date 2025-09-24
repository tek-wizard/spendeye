import { useQuery } from '@tanstack/react-query';
import { fetchExpensesAPI } from '../api/expenseService';

export const useExpenses = () => {
  const { 
    data: rawExpenses, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: fetchExpensesAPI,
    // This is crucial: it selects the 'expenses' array from the API response object.
    // The backend returns { success: true, expenses: [...] }, this gives us just the array.
    select: (data) => data.expenses,
  });

  // Return an empty array as a safe default while loading or on error
  return { rawExpenses: rawExpenses || [], isLoading, error };
};