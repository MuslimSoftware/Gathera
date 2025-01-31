import { useFetch } from '../../../shared/hooks/useFetch';

export const useUnblockUser = (userId: string, onUnblockSuccess: () => void) => {
    const { isLoading, error, fetchAsync } = useFetch();

    const sendRequest = async () => {
        await fetchAsync({ url: `/user/unblock/${userId}`, method: 'POST' }, onUnblockSuccess);
    };

    return {
        isLoading,
        error,
        sendRequest,
    };
};
