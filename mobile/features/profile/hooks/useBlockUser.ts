import { useFetch } from '../../../shared/hooks/useFetch';

export const useBlockUser = (userId: string, onBlockSuccess: () => void) => {
    const { isLoading, error, fetchAsync } = useFetch();

    const blockUser = async () => {
        await fetchAsync({ url: `/user/block/${userId}`, method: 'POST' }, onBlockSuccess);
    };

    return {
        isLoading,
        error,
        blockUser,
    };
};
