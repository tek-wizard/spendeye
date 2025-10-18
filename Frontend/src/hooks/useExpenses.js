import { useQuery } from '@tanstack/react-query';
import { fetchExpensesAPI } from '../api/expenseService';

// THE FIX: The hook now accepts the dateRange object as an argument.
export const useExpenses = (dateRange) => {
  const { 
    data: rawExpenses, 
    isLoading, 
    error 
  } = useQuery({
    // THE FIX: The queryKey now includes the dateRange.
    // When dateRange changes, React Query will automatically refetch the data.
    queryKey: ['expenses', dateRange],
    
    // The queryFn now passes the dateRange to the API call.
    queryFn: () => fetchExpensesAPI(dateRange),
    
    select: (data) => data.expenses,
  });

  return { rawExpenses: rawExpenses || [], isLoading, error };
};