import { useQuery } from '@tanstack/react-query';
import { fetchCreditorsAPI } from '../api/ledgerService';

export const useCreditors = (options = {}) => {
  return useQuery({
    queryKey: ['creditors'],
    queryFn: fetchCreditorsAPI,
    select: (data) => data.map(c => ({ id: c._id, name: c._id, amount: c.totalAmount })),
    ...options,
  });
};