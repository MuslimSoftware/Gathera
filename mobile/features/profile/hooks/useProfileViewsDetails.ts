import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { View } from '../../../types/View';

export const useProfileViewsDetails = (userId: string) => {
    const { error, isLoading, data, loadMore, refresh } = usePaginatedFetch<View>(`/user/profile-views-details/${userId}`);

    return {
        profileViewsError: error,
        profileViewsLoading: isLoading,
        profileViews: data,
        fetchMoreProfileViews: loadMore,
        refreshProfileViews: refresh,
    };
};
