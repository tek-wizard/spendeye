import { useQuery } from '@tanstack/react-query';
import { fetchLedgerHistoryAPI } from '../api/ledgerService';

export const useLedgerHistory = (personName) => {
  return useQuery({
    queryKey: ['ledgerHistory', personName],
    queryFn: () => fetchLedgerHistoryAPI(personName),
    // This is crucial: the query will only run if a personName is selected.
    enabled: !!personName,
  });
};