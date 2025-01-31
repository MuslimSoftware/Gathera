import React, { useState } from 'react';
import { HeaderPageLayout } from '../layouts/HeaderPageLayout';
import { UserPickerList } from './UserPickerList';
import { useQueryUsers } from '../../features/discover/hooks/useQueryUsers';
import { ErrorMessage } from './ErrorMessage';

interface UserSelectorScreenProps {
    title: string;
    submitLabel: string;
    onSubmit: (selectedUsers: Array<any>) => void;
    userFilter?: Array<any>;
    isLoading?: boolean;
    error?: string;
}

export const UserSelectorScreen = ({ title, submitLabel, onSubmit, userFilter, isLoading, error }: UserSelectorScreenProps) => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [queryDebounced, setQueryDebounced] = useState('');
    const [timeoutId, setTimeoutId] = useState<any>(null);
    const { users, fetchUsers, refreshUsers, isUsersLoading, usersError } = useQueryUsers(queryDebounced);
    const [selectedUsers, setSelectedUsers] = useState<Array<any>>([]);

    const setQueryDebouncedFn = (query: string) => {
        setSearchQuery(query);
        clearTimeout(timeoutId);

        const timeout = setTimeout(() => {
            setQueryDebounced(query);
        }, 400);

        setTimeoutId(timeout);
    };

    const onUserSelected = (selectedUser: any) => {
        setSelectedUsers((prev) =>
            prev.some((item) => item._id === selectedUser._id) ? prev.filter((item) => item._id !== selectedUser._id) : [...prev, selectedUser]
        );
    };

    // Only show users that:
    // - Are NOT in the userFilter
    // - Have display_names that match the searchQuery
    // - That have isVisible = true
    const displayedUsers = users.filter(
        (u: any) => !userFilter?.some((item) => item._id === u._id) && u.display_name.toLowerCase().includes(searchQuery.toLowerCase()) && u.isVisible
    );
    return (
        <HeaderPageLayout
            title={title}
            submit={{ label: submitLabel, onSubmit: () => onSubmit(selectedUsers), canSubmit: selectedUsers.length > 0, isLoading }}
        >
            {error && <ErrorMessage message={error} />}
            <UserPickerList
                isLoading={isUsersLoading}
                error={usersError}
                userList={displayedUsers}
                onUserSelected={onUserSelected}
                searchQuery={searchQuery}
                selectedUsers={selectedUsers}
                setSearchQuery={setQueryDebouncedFn}
                fetchUsers={fetchUsers}
                refreshUsers={refreshUsers}
            />
        </HeaderPageLayout>
    );
};
