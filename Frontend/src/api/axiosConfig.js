import axios from 'axios';

const API_URL=import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL, // Your backend's base URL
  withCredentials: true, 
});

export default api;