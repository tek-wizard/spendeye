import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { resetPasswordAPI } from '../api/authService';

export const useResetPassword = () => {
    const navigate = useNavigate();

    const { mutate: resetPassword, isPending: isResetting } = useMutation({
        mutationFn: resetPasswordAPI,
        onSuccess: (data) => {
            toast.success(data.message || "Password reset successfully. Please log in.");
            // Redirect the user to the login page after a successful reset
            navigate('/auth');
        },
        onError: (err) => {
            // The backend sends a clear error for invalid or expired tokens
            toast.error(err.response?.data?.message || "Reset link is invalid or has expired.");
            // Optionally, redirect them away from the invalid page
            navigate('/auth');
        },
    });

    return { resetPassword, isResetting };
};