import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { forgotPasswordAPI } from '../api/authService'; 

export const useForgotPassword = () => {
    const { mutate: forgotPassword, isPending, isSuccess, reset } = useMutation({
        mutationFn: forgotPasswordAPI,
        onSuccess: (data) => {
            // The backend returns a generic success message to prevent user enumeration.
            // We show a simple toast only on error. The success UI transition is handled by isSuccess state.
        },
        onError: (err) => {
            // Display a specific error if the network request fails for other reasons.
            toast.error(err.response?.data?.message || "Failed to process reset request.");
        },
    });

    return { forgotPassword, isPending, isSuccess, reset };
};