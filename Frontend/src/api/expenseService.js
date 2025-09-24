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
export const fetchExpensesAPI = async () => {
  const now = new Date();
  const startDate = startOfMonth(now);
  const endDate = endOfMonth(now);

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