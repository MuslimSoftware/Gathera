import { useFetch } from '../../../shared/hooks/useFetch';

export const useRespondToGatheringInvite = (notificationId: string) => {
    const { error, isLoading, fetchAsync } = useFetch();

    const _respondToGatheringInvite = async (accept: boolean) => {
        await fetchAsync({ url: `/gathering/respond-invite/${notificationId}`, method: 'POST', body: { join: accept } }, (data: any) => {});
    };

    const acceptGatheringInvite = async () => await _respondToGatheringInvite(true);
    const denyGatheringInvite = async () => await _respondToGatheringInvite(false);

    return {
        error,
        isLoading,
        acceptGatheringInvite,
        denyGatheringInvite,
    };
};
