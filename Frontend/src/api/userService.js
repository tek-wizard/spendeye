import api from './axiosConfig';

export const fetchContactsAPI = async () => {
  const { data } = await api.get('/users/contacts');
  return data.contacts; // Unpack the array
};

export const addContactAPI = async (contactData) => {
  // Your backend route is PATCH
  const { data } = await api.patch('/users/contacts/add', contactData);
  return data;
};

export const updateBudgetAPI = async (budgetData) => {
  // The backend expects an object like { budget: 50000 }
  const { data } = await api.patch('/users/budget', budgetData);
  return data;
};

export const updateProfileAPI = async (profileData) => {
  const { data } = await api.patch('/users/profile', profileData);
  return data;
};