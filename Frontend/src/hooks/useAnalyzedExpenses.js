import { useQuery } from '@tanstack/react-query';
import { fetchAnalyzedExpensesAPI } from '../api/expenseService';

// A stable, empty object to use as a fallback. This ensures the page
// always has data in the correct shape, even during the first load.
const emptyData = {
  metrics: null,
  categoryBreakdown: [],
  transactions: [],
  pagination: null,
};

export const useAnalyzedExpenses = (filters) => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['analyzedExpenses', filters],
    queryFn: () => fetchAnalyzedExpensesAPI(filters),
    // This is the key: it keeps showing old data while new data is fetched.
    keepPreviousData: true,
  });

  // By returning 'data || emptyData', we guarantee that your components
  // never receive an 'undefined' data object. This is what prevents the
  // layout from breaking and creates the smooth transition.
  return { 
    data: data || emptyData, 
    isLoading, 
    isFetching,
  };
};