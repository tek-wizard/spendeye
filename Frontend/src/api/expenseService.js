import api from './axiosConfig';
import { startOfMonth, endOfMonth } from 'date-fns';

export const fetchDashboardSummaryAPI = async ({ startDate, endDate } = {}) => {
  const now = new Date();
  const finalStartDate = startDate || startOfMonth(now);
  const finalEndDate = endDate || endOfMonth(now);

  const params = new URLSearchParams({
    startDate: finalStartDate.toISOString(),
    endDate: finalEndDate.toISOString(),
  });
  const { data } = await api.get(`/expense/summary?${params.toString()}`);
  return data;
};

// This function fetches the raw list of expenses
export const fetchExpensesAPI = async (dateRange) => {
  // Use the provided dateRange, or default to the current month if it's missing.
  const startDate = dateRange?.startDate || startOfMonth(new Date());
  const endDate = dateRange?.endDate || endOfMonth(new Date());

  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  
  const url = `/expense?${params.toString()}`;
  const { data } = await api.get(url);
  
  return data;
};

export const createExpenseAPI = async (expenseData) => {
  const { data } = await api.post('/expense/create', expenseData);
  return data;
};

export const updateExpenseAPI = async ({ expenseId, expenseData }) => {
  const { data } = await api.put(`/expense/${expenseId}`, expenseData);
  return data;
};

export const deleteExpenseAPI = async (expenseId) => {
  const { data } = await api.delete(`/expense/${expenseId}`);
  return data;
};

export const fetchSubTransactionsAPI = async (ids) => {
  const { data } = await api.post('/expense/subtransactions', { ids });
  return data.subTransactions;
};

export const fetchAnalyzedExpensesAPI = async (filters) => {
  const params = new URLSearchParams();

  // Append filters to the params object only if they have a value
  if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
  if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
  if (filters.search) params.append('search', filters.search);
  if (filters.categories && filters.categories.length > 0) {
    params.append('categories', filters.categories.join(','));
  }
  if (filters.minAmount) params.append('minAmount', filters.minAmount);
  if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
  // Check for null because isSplit can be 'false'
  if (filters.isSplit !== null && filters.isSplit !== undefined) params.append('isSplit', filters.isSplit);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const { data } = await api.get(`/expense/analyze?${params.toString()}`);
  return data.data; // The backend wraps the payload, so we unwrap it here
};