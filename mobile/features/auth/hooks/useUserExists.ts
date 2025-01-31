import { useFetch } from '../../../shared/hooks/useFetch';

type UserExistsResponseHandler = (userExists: boolean) => void;

/**
 * Checks if the user exists in the database and determines whether to send them to the sign up flow or login flow.
 * @param phone_number
 * @param navigateToNextScreen
 */
export const useUserExists = () => {
    const { fetchAsync, isLoading, error, setError } = useFetch(false);

    const fetchUserExists = async (onSuccess: UserExistsResponseHandler, phoneNumber?: string, email?: string) => {
        if (!phoneNumber && !email) return;

        const body: any = {};
        if (phoneNumber) body.phone_number = phoneNumber;
        if (email) body.email = email;

        await fetchAsync({ url: '/auth/user-exists', method: 'POST', body }, (userExists: boolean) => {
            if (onSuccess) onSuccess(userExists);
        });
    };

    return { fetchUserExists, isLoading, error, setError };
};
