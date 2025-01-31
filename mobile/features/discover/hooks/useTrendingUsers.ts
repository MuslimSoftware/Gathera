import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { UserPreviewWithFollowers } from '../../../types/User';

export const useTrendingUsers = () => {
    const {
        error: trendingUsersError,
        isLoading: isLoadingTrendingUsers,
        data: trendingUsers,
        loadMore: fetchTrendingUsers,
        refresh: refreshTrendingUsers,
    } = usePaginatedFetch<UserPreviewWithFollowers>(`/user/trending`);

    return {
        trendingUsers,
        trendingUsersError,
        isLoadingTrendingUsers,
        fetchTrendingUsers,
        refreshTrendingUsers,
    };
};
