import React from 'react';
import { StyleSheet } from 'react-native';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { FollowRequestNotificationItem } from './NotificationItemWrappers/FollowRequestNotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { getNotificationContextValues } from '../context/NotificationContext';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { FollowNotificationItemSkeleton } from './NotificationItemWrappers/FollowNotificationItem';
import { useNavigate } from '../../../shared/hooks/useNavigate';

export const FollowRequests = () => {
    const { notifications, error, setNotifications, fetchNotifications, refreshNotifications, isLoading } = useNotifications('followReq');
    const { setFollowRequestsCount } = getNotificationContextValues();
    const { popScreen } = useNavigate();

    const onNotificationAction = (notification: any) => {
        setNotifications((prevNotifications: any) => {
            return prevNotifications.filter((prevNotification: any) => prevNotification._id !== notification._id);
        });
        setFollowRequestsCount((prevCount: number) => prevCount - 1);
    };

    return (
        <HeaderPageLayout title='Follow Requests' handleBackBtnPress={popScreen}>
            <PaginatedList
                data={notifications}
                error={error}
                style={styles.flatList}
                contentContainerStyle={styles.contentContainerStyle}
                refresh={refreshNotifications}
                renderItem={({ item }) => (
                    <FollowRequestNotificationItem notification={item} onNotificationPress={() => onNotificationAction(item)} />
                )}
                keyExtractor={(item) => item._id}
                onEndReached={fetchNotifications}
                isLoading={isLoading}
                dataName='follow requests'
                renderSkeletonItem={() => <FollowNotificationItemSkeleton />}
            />
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    flatList: {
        paddingVertical: 10,
    },
    contentContainerStyle: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
});
