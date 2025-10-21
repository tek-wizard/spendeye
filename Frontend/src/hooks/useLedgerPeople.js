import { useQuery } from '@tanstack/react-query';
import { fetchLedgerPeopleAPI } from '../api/ledgerService';

export const useLedgerPeople = () => {
  return useQuery({
    queryKey: ['ledgerPeople'],
    queryFn: fetchLedgerPeopleAPI,
  });
};