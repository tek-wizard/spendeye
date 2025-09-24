import { useQuery } from '@tanstack/react-query';
import { fetchDebtorsAPI } from '../api/ledgerService';

export const useDebtors = (options = {}) => {
  return useQuery({
    queryKey: ['debtors'],
    queryFn: fetchDebtorsAPI,
    select: (data) => data.map(d => ({ id: d._id, name: d._id, amount: d.totalAmount })),
    ...options,
  });
};