import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { IPlace } from '../../../types/Place';

/**
 * Fetches the places that a user has liked
 * @param profileId
 * @returns List of places that the user has liked
 */
export const useLikedPlaces = (profileId: string) => {
    const { error, isLoading, data, loadMore, refresh } = usePaginatedFetch<IPlace>(`/user/profile/liked-places/${profileId}`);

    return {
        places: data,
        error,
        isLoading,
        loadMore,
        refresh,
    };
};
