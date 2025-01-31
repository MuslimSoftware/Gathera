import { IPlace } from '../../../types/Place';
import { usePaginatedQueryFetch } from '../../../shared/hooks/usePaginatedQueryFetch';

export const useQueryPlaces = (query: string) => {
    const { data: places, isLoading, error, loadMore: fetchPlaces, refresh } = usePaginatedQueryFetch<IPlace>('/place', 'query', query, 'name');

    return {
        places,
        isPlacesLoading: isLoading,
        placesError: error,
        fetchPlaces,
        refreshPlaces: refresh,
    };
};
