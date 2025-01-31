import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import UserList from '../../../../shared/components/User/UserList';
import { usePaginatedFetch } from '../../../../shared/hooks/usePaginatedFetch';
import { UserPreview } from '../../../../types/User';

const ProfileFollowingList = ({ route }: { route: any }) => {
    const { profileId } = route.params;

    const { error, isLoading, data: users, loadMore: fetchUsers, refresh } = usePaginatedFetch<UserPreview>(`/user/profile/following/${profileId}`);

    if (error) {
        return (
            <View style={styles.messageWrapper}>
                <Text>There was an error fetching this user's following: {error}</Text>
            </View>
        );
    }

    return <UserList users={users} isLoading={isLoading} refresh={refresh} fetchUsers={fetchUsers} enableBottomPadding />;
};

export default ProfileFollowingList;

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
    },
    messageWrapper: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
});
