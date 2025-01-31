import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { FestivalIcon, InboxIcon, PersonAddIcon } from '../../../shared/components/Core/Icons';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { StatusBar } from 'expo-status-bar';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { getNotificationContextValues } from '../context/NotificationContext';
import { RequestsButton } from '../components/RequestsButton';
import FollowNotificationItem, { FollowNotificationItemSkeleton } from '../components/NotificationItemWrappers/FollowNotificationItem';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { IconWithRedNumberBadge } from '../../../shared/components/Core/IconWithRedNumberBadge';
import { Sizes } from '../../../shared/styles/Styles';
import { getNavigationBarBottomPadding } from '../../../shared/utils/uiHelper';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { useNotifications } from '../hooks/useNotifications';
import { useOnFocus } from '../../../shared/hooks/useOnFocus';
import { UserPreview } from '../../../types/User';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';

interface NotificationsScreenProps {
    navigation: any;
}

export const NotificationsScreen = React.memo(({}: NotificationsScreenProps) => {
    const {
        user: { is_public: isPublic },
    } = getAuthContextValues();
    const { navigateToScreen, pushScreen } = useNavigate();

    const {
        unreadFollowsCount,
        setUnreadFollowsCount,
        followRequestsCount,
        unreadMessagesCount,
        gatheringInvitesCount,
        getUnreadNotificationsCount,
    } = getNotificationContextValues();

    const {
        notifications,
        error: notificationsError,
        setNotifications,
        fetchNotifications,
        refreshNotifications: refreshFollowNotifications,
        isLoading,
    } = useNotifications('follow');

    const refreshNotifications = () => {
        refreshFollowNotifications();
    };

    useOnFocus(getUnreadNotificationsCount);

    useEffect(() => {
        if (notifications.length > 0 && unreadFollowsCount > 0) {
            setUnreadFollowsCount(0);
        }
    }, [notifications]);

    const handleFollowRequestBtnPress = () => {
        // navigate to follow requests screen
        pushScreen('FollowRequests');
    };

    const handleInviteRequestBtnPress = () => {
        // navigate to invite requests screen
        pushScreen('InviteRequests');
    };

    const renderItem = ({ item }: { item: UserPreview }) => {
        if (item._id === 'followRequestsBtn') {
            if (isPublic) return <></>;

            return (
                <>
                    <RequestsButton
                        title='Follow Requests'
                        subtitle='Accept or ignore requests'
                        Icon={PersonAddIcon}
                        numRequests={followRequestsCount}
                        onPress={handleFollowRequestBtnPress}
                    />
                </>
            );
        }

        if (item._id === 'inviteRequestsBtn') {
            return (
                <>
                    <RequestsButton
                        title='Gathering Invites'
                        subtitle='Accept or ignore requests'
                        Icon={FestivalIcon}
                        numRequests={gatheringInvitesCount}
                        onPress={handleInviteRequestBtnPress}
                    />
                </>
            );
        }

        if (item._id === 'errorMessage') return <ErrorMessage message={notificationsError} />;

        return <FollowNotificationItem notification={item} />;
    };

    const renderSkeletonItem = (item: any) => {
        return <FollowNotificationItemSkeleton />;
    };

    // prepend followRequestsBtn and inviteRequestsBtn to notifications array to display them as buttons at the top of the list
    const data = [{ _id: 'followRequestsBtn' }, { _id: 'inviteRequestsBtn' }, { _id: 'errorMessage' }, ...notifications];

    const loadMore = () => {
        if (data.length < 10) return;

        fetchNotifications();
    };

    return (
        <HeaderPageLayout
            title='Notifications'
            showBackBtn={false}
            headerRight={
                <IconWithRedNumberBadge
                    icon={<InboxIcon size={Sizes.ICON_SIZE_MD} />}
                    onPress={() => navigateToScreen('Inbox')}
                    badgeNumber={unreadMessagesCount}
                />
            }
        >
            <StatusBar style='dark' />
            <PaginatedList
                data={isLoading ? [] : data}
                isLoading={isLoading}
                renderItem={renderItem}
                renderSkeletonItem={renderSkeletonItem}
                numSkeletonItemsToRender={10}
                dataName='notifications'
                onEndReached={loadMore}
                refresh={refreshNotifications}
                contentContainerStyle={[styles.flatList, { paddingVertical: getNavigationBarBottomPadding() }]}
            />
        </HeaderPageLayout>
    );
});

const styles = StyleSheet.create({
    flatList: {
        paddingTop: 5,
        gap: 2.5,
    },
});
