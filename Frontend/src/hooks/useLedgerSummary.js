import { useQuery } from '@tanstack/react-query';
import { fetchLedgerSummaryAPI } from '../api/ledgerService';

export const useLedgerSummary = () => {
  return useQuery({
    queryKey: ['ledgerSummary'],
    queryFn: fetchLedgerSummaryAPI,
    // Adapt the backend data structure to what the UI component expects
    select: (data) => {
      const owedToYou = data.find(s => s._id === 'Lent') || { totalAmount: 0, count: 0 };
      const youOwe = data.find(s => s._id === 'Borrowed') || { totalAmount: 0, count: 0 };
      return {
        owedToYou: owedToYou.totalAmount,
        youOwe: youOwe.totalAmount,
        owedCount: owedToYou.count,
        oweCount: youOwe.count,
      };
    },
  });
};