import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { Photo } from '../../../types/Photo';

export const usePhotos = (place_id: string) => {
    const { data: photos, error, isLoading, loadMore: fetchPhotos, refresh } = usePaginatedFetch<Photo>(`/place/photos/${place_id}`);

    return { photos, fetchPhotos, error, isLoading, refresh };
};
