import { useQuery } from '@tanstack/react-query';
import { fetchSubTransactionsAPI } from '../api/expenseService';

export const useGetSubTransactions = (transaction) => {
  const isParent = transaction?.isParent;
  const ids = transaction?.subTransactions || [];

  return useQuery({
    queryKey: ['subTransactions', transaction?._id],
    queryFn: () => fetchSubTransactionsAPI(ids),
    // Only run this query if the selected transaction is a parent and has children
    enabled: !!isParent && ids.length > 0,
  });
};

//DELETE