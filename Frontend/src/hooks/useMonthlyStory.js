import { useQuery } from '@tanstack/react-query';
import { fetchMonthlyStoryAPI } from '../api/expenseService';
import { format } from 'date-fns';

export const useMonthlyStory = (month) => {
  return useQuery({
    queryKey: ['monthlyStory', format(month, 'yyyy-MM')],
    queryFn: () => fetchMonthlyStoryAPI(month),
    keepPreviousData: true,
    // This line disables the automatic refetch on tab focus.
    refetchOnWindowFocus: false, 
  });
};