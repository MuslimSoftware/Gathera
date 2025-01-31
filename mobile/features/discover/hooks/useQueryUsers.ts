import { UserPreview } from '../../../types/User';
import { usePaginatedQueryFetch } from '../../../shared/hooks/usePaginatedQueryFetch';

export const useQueryUsers = (query: string) => {
    const { data: usersData, isLoading, error, loadMore, refresh } = usePaginatedQueryFetch<UserPreview>('/user/all-users', 'display_name', query);

    return {
        users: usersData,
        isUsersLoading: isLoading,
        usersError: error,
        fetchUsers: loadMore,
        refreshUsers: refresh,
    };
};
