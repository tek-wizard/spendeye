import api from './axiosConfig';

export const fetchLedgerSummaryAPI = async () => {
  const { data } = await api.get('/ledger/summary');
  return data.summary; // Unpack the array
};

export const fetchDebtorsAPI = async () => {
  const { data } = await api.get('/ledger/debtors');
  return data.Debtors;
};

export const fetchCreditorsAPI = async () => {
  const { data } = await api.get('/ledger/creditors');
  return data.Creditors;
};

export const createIOUAPI = async (iouData) => {
  const { data } = await api.post('/ledger/create', iouData);
  return data;
};

export const settleDebtsAPI = async (settlementData) => {
  const { data } = await api.post('/ledger/settle', settlementData);
  return data;
};

export const createLedgerEntryAPI = async (ledgerData) => {
  const { data } = await api.post('/ledger/create', ledgerData);
  return data;
};