import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { View } from '../../../types/View';

export const useGatheringViewsDetails = (gatheringId: string) => {
    const { error, isLoading, data, loadMore, refresh } = usePaginatedFetch<View>(`/gathering/views-details/${gatheringId}`);

    return {
        error,
        isLoading,
        data,
        loadMore,
        refresh,
    };
};
