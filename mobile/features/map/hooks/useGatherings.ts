import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { Gathering } from '../../../types/Gathering';

export const useGatherings = (place_id: string) => {
    const { data: gatherings, error, isLoading, loadMore: fetchGatherings, refresh } = usePaginatedFetch<Gathering>(`/gathering/place/${place_id}`);

    return { gatherings, fetchGatherings, error, isLoading, refresh };
};
