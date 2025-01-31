import { useFetch } from '../../../shared/hooks/useFetch';

export const useRespondToFollowRequest = (notificationId: string) => {
    const { error, isLoading, fetchAsync } = useFetch();

    const _respondToFollowRequest = async (accept: boolean) => {
        await fetchAsync({ url: `/user/respond-to-follow-request/${notificationId}`, method: 'POST', body: { accept } }, (data: any) => {});
    };

    const acceptFollowRequest = async () => await _respondToFollowRequest(true);
    const denyFollowRequest = async () => await _respondToFollowRequest(false);

    return {
        error,
        isLoading,
        acceptFollowRequest,
        denyFollowRequest,
    };
};
