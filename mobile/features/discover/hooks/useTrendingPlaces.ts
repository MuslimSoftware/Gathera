import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { IPlace } from '../../../types/Place';

export const useTrendingPlaces = () => {
    const {
        error: trendingPlacesError,
        isLoading: isLoadingTrendingPlaces,
        data: trendingPlaces,
        loadMore: fetchTrendingPlaces,
        refresh: refreshTrendingPlaces,
    } = usePaginatedFetch<IPlace>(`/place/trending`);

    return {
        trendingPlaces,
        trendingPlacesError,
        isLoadingTrendingPlaces,
        fetchTrendingPlaces,
        refreshTrendingPlaces,
    };
};
