import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { View } from '../../../types/View';

export const usePlaceViewsDetails = (placeId: string) => {
    const { error, isLoading, data, loadMore, refresh } = usePaginatedFetch<View>(`/place/views-details/${placeId}`);

    return {
        error,
        isLoading,
        data,
        loadMore,
        refresh,
    };
};
