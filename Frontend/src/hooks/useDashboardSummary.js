import { useQuery } from '@tanstack/react-query';
import { fetchDashboardSummaryAPI } from '../api/expenseService';

export const useDashboardSummary = (dateRange) => {
  // Directly return the entire result from useQuery
  return useQuery({
    queryKey: ['dashboardSummary', dateRange],
    queryFn: () => fetchDashboardSummaryAPI(dateRange),
    select: (data) => {
      if (!data.success) {
        throw new Error(data.message || 'API returned success:false');
      }
      
      return {
        summaryCard: data.summaryCard,
        sparklineData: data.sparklineData,
        spendingChartData: data.spendingChartData,
      };
    },
  });
};