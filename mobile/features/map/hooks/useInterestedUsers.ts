import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { UserPreview } from '../../../types/User';

export const useInterestedUsers = (place_id: string) => {
    const {
        data: interestedUsers,
        setData: setInterestedUsers,
        error,
        isLoading,
        loadMore: fetchUsers,
        refresh,
    } = usePaginatedFetch<UserPreview>(`/place/interested-users/${place_id}`);

    return {
        interestedUsers,
        setInterestedUsers,
        error,
        isLoading,
        fetchUsers,
        refresh,
    };
};
