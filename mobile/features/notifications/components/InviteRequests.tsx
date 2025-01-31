import React from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { GatheringInviteNotificationItem } from './NotificationItemWrappers/GatheringInviteNotificationItem';
import { useNotifications } from '../hooks/useNotifications';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { GatheringListItemSkeleton } from '../../../shared/components/ListItems/Gathering/GatheringListItem';
import { useNavigate } from '../../../shared/hooks/useNavigate';

export const InviteRequests = () => {
    const { notifications, error, isLoading, setNotifications, fetchNotifications, refreshNotifications } = useNotifications('invite');
    const { popScreen } = useNavigate();

    return (
        <HeaderPageLayout title='Gathering Invites' handleBackBtnPress={popScreen}>
            <PaginatedList
                refreshControl={<RefreshControl refreshing={false} onRefresh={refreshNotifications} />}
                data={notifications}
                style={styles.flatListStyle}
                contentContainerStyle={styles.contentContainerStyle}
                renderItem={({ item }) => <GatheringInviteNotificationItem notification={item} setNotifications={setNotifications} />}
                keyExtractor={(item) => item._id}
                onEndReached={fetchNotifications}
                isLoading={isLoading}
                error={error}
                renderSkeletonItem={() => <GatheringListItemSkeleton />}
            />
        </HeaderPageLayout>
    );
};

const styles = StyleSheet.create({
    flatListStyle: {
        paddingVertical: 10,
    },
    contentContainerStyle: {
        gap: 7.5,
    },
});
