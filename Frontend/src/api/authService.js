import api from './axiosConfig';

export const registerUserAPI = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data;
};

export const loginUserAPI = async (credentials) => {
  const { data } = await api.post('/auth/login', credentials);
  return data;
};

export const verifyUserAPI = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const logoutUserAPI = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const changePasswordAPI = async (passwordData) => {
  const { data } = await api.post('/auth/change-password', passwordData);
  return data;
};

export const deleteAccountAPI = async () => {
  const { data } = await api.delete('/auth/me');
  return data;
};