import { useMutation } from '@tanstack/react-query';
import { loginUserAPI } from '../api/authService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useLoginUser = () => {
  const navigate = useNavigate();

  const { 
    mutate, 
    isPending, 
    isError, 
    error 
  } = useMutation({
    mutationFn: loginUserAPI,
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.user.username}!`);
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Invalid credentials');
    },
  });

  return { 
    loginUser: mutate, 
    isLoggingIn: isPending, 
    loginError: error 
  };
};