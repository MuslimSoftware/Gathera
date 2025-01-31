import React from 'react';
import UserList from '../../../shared/components/User/UserList';
import { useOnFocus } from '../../../shared/hooks/useOnFocus';

interface PlaceLikesListProps {
    interestedUsers: any;
    fetchUsers: any;
    isLoading: boolean;
    refresh: any;
}

export const PlaceLikesList = React.memo(({ interestedUsers, fetchUsers, isLoading, refresh }: PlaceLikesListProps) => {
    useOnFocus(refresh);

    return <UserList users={interestedUsers} fetchUsers={fetchUsers} isLoading={isLoading} refresh={refresh} />;
});
