import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';

export const useUnreadNotificationsCount = () => {
    const [unreadFollowsCount, setUnreadFollowsCount] = useState<number>(0);
    const [followRequestsCount, setFollowRequestsCount] = useState<number>(0);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState<number>(0);
    const [gatheringInvitesCount, setGatheringInvitesCount] = useState<number>(0);
    const { isLoading, error, fetchAsync } = useFetch();

    const getUnreadNotificationsCount = async () => {
        await fetchAsync({ url: '/notification/unread' }, (data: any) => {
            setUnreadFollowsCount(data.unreadFollowNotifications);
            setUnreadMessagesCount(data.unreadMessagesCount);

            setFollowRequestsCount(data.followRequestsCount);
            setGatheringInvitesCount(data.gatheringInvitesCount);
        });
    };

    useEffect(() => {
        getUnreadNotificationsCount();
    }, []);

    return {
        isLoading,
        error,
        getUnreadNotificationsCount,
        unreadFollowsCount,
        followRequestsCount,
        unreadMessagesCount,
        notificationsCount: unreadFollowsCount + unreadMessagesCount + followRequestsCount + gatheringInvitesCount,
        gatheringInvitesCount,

        setUnreadFollowsCount,
        setFollowRequestsCount,
        setUnreadMessagesCount,
        setGatheringInvitesCount,
    };
};
