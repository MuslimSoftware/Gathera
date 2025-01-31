import React from 'react';
import { StyleSheet } from 'react-native';
import { UserPreview } from '../../../types/User';
import { FollowUserListItem } from '../ListItems/FollowUserListItem';
import { UserListItemSkeleton } from '../ListItems/UserListItem';
import { PaginatedList } from '../Core/PaginatedList';
import { getNavigationBarBottomPadding } from '../../utils/uiHelper';

interface UserListProps {
    users: UserPreview[];
    isLoading: boolean;
    error?: string;
    fetchUsers: () => void;
    maxUsers?: number;
    refresh?: () => void;
    style?: any;
    contentContainerStyle?: any;
    enableBottomPadding?: boolean;
}

const UserList = ({
    users,
    error,
    isLoading,
    fetchUsers,
    maxUsers,
    refresh,
    style,
    contentContainerStyle,
    enableBottomPadding = false,
}: UserListProps) => {
    const bottomPadding = getNavigationBarBottomPadding() + 10;

    return (
        <PaginatedList
            data={users}
            isLoading={isLoading}
            error={error}
            refresh={refresh}
            renderItem={({ item }) => <FollowUserListItem profile={item} />}
            renderSkeletonItem={UserListItemSkeleton}
            numSkeletonItemsToRender={10}
            maxDataItemsToRender={maxUsers}
            onEndReached={fetchUsers}
            style={[styles.list, style]}
            contentContainerStyle={[styles.listContent, contentContainerStyle, enableBottomPadding && { paddingBottom: bottomPadding }]}
            dataName='users'
        />
    );
};

export default UserList;

const styles = StyleSheet.create({
    list: {
        width: '100%',
        paddingVertical: 5,
    },
    listContent: {
        paddingHorizontal: 10,
        gap: 5,
    },
});
