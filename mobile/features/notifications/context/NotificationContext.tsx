import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from 'react';
import { useUnreadNotificationsCount } from '../hooks/useUnreadNotificationsCount';

interface NotificationContextProps {
    followRequestsCount: number;
    unreadFollowsCount: number;
    unreadMessagesCount: number;
    gatheringInvitesCount: number;

    setFollowRequestsCount: Dispatch<SetStateAction<number>>;
    setUnreadFollowsCount: Dispatch<SetStateAction<number>>;
    setUnreadMessagesCount: Dispatch<SetStateAction<number>>;
    setGatheringInvitesCount: Dispatch<SetStateAction<number>>;

    notificationsCount: number;
    getUnreadNotificationsCount: () => void;
}

const notificationContextDefaultValues: NotificationContextProps = {
    followRequestsCount: 0,
    unreadFollowsCount: 0,
    unreadMessagesCount: 0,
    gatheringInvitesCount: 0,

    setFollowRequestsCount: () => {},
    setUnreadFollowsCount: () => {},
    setUnreadMessagesCount: () => {},
    setGatheringInvitesCount: () => {},

    notificationsCount: 0,
    getUnreadNotificationsCount: () => {},
};

export const NotificationContext = createContext(notificationContextDefaultValues);

export function getNotificationContextValues() {
    return useContext(NotificationContext);
}

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
    const {
        isLoading: isUnreadNotisLoading,
        error: unreadNotisError,
        getUnreadNotificationsCount,

        unreadFollowsCount,
        followRequestsCount,
        unreadMessagesCount,

        setFollowRequestsCount,
        setUnreadFollowsCount,
        setUnreadMessagesCount,

        notificationsCount,
        gatheringInvitesCount,
        setGatheringInvitesCount,
    } = useUnreadNotificationsCount();

    return (
        <NotificationContext.Provider
            value={{
                unreadFollowsCount,
                unreadMessagesCount,
                followRequestsCount,
                gatheringInvitesCount,

                setFollowRequestsCount,
                setUnreadFollowsCount,
                setUnreadMessagesCount,
                setGatheringInvitesCount,

                notificationsCount,
                getUnreadNotificationsCount,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
