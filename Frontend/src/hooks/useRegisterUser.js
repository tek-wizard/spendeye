import { useMutation } from '@tanstack/react-query';
import { registerUserAPI } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useRegisterUser = () => {
  const navigate = useNavigate();

  const { 
    mutate, 
    isPending, 
    isError, 
    error 
  } = useMutation({
    mutationFn: registerUserAPI,
    onSuccess: (data) => {
      toast.success(`Welcome, ${data.user.username}!`);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    },
  });

  return { 
    registerUser: mutate, 
    isRegistering: isPending, 
    registrationError: error 
  };
};