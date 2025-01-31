import { StyleSheet, View } from 'react-native';
import React from 'react';
import { SelectableUserListItem } from './ListItems/SelectableUserListItem';
import UserNameRow from './UserNameRow';
import SearchBar from '../../features/discover/components/SearchBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PaginatedList } from './Core/PaginatedList';
import { UserListItemSkeleton } from './ListItems/UserListItem';

interface UserPickerListProps {
    userList: Array<any>;
    isLoading: boolean;
    error: string | null | undefined;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedUsers: Array<any>;
    onUserSelected: (user: any) => void;
    fetchUsers: () => void;
    refreshUsers: () => void;
}

export const UserPickerList = ({
    userList,
    selectedUsers,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    onUserSelected,
    fetchUsers,
    refreshUsers,
}: UserPickerListProps) => {
    return (
        <View style={styles.wrapper}>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <UserNameRow users={selectedUsers} />
            <PaginatedList
                style={{ flex: 1 }}
                contentContainerStyle={[styles.listContent, { paddingBottom: useSafeAreaInsets().bottom }]}
                data={userList}
                refresh={refreshUsers}
                onEndReached={fetchUsers}
                onEndReachedThreshold={1}
                renderItem={({ item }) => <SelectableUserListItem profile={item} onSelected={() => onUserSelected(item)} />}
                error={error}
                isLoading={isLoading}
                renderSkeletonItem={() => <UserListItemSkeleton />}
            />
        </View>
    );
};

export default UserPickerList;

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
        gap: 5,
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 5,
    },
});
