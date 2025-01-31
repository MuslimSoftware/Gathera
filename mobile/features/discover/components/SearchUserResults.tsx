import React from 'react';
import UserList from '../../../shared/components/User/UserList';
import { getSearchContextValues } from '../context/SearchContext';
import { useOnFocus } from '../../../shared/hooks/useOnFocus';

export const SearchUserResults = () => {
    const { users, isUsersLoading, usersError, fetchUsers, refreshUsers } = getSearchContextValues();

    useOnFocus(() => {
        !isUsersLoading && refreshUsers();
    });

    return (
        <UserList users={users} isLoading={isUsersLoading} error={usersError} refresh={refreshUsers} fetchUsers={fetchUsers} enableBottomPadding />
    );
};
