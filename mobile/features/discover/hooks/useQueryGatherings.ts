import { Gathering } from '../../../types/Gathering';
import { usePaginatedQueryFetch } from '../../../shared/hooks/usePaginatedQueryFetch';

export const useQueryGatherings = (query: string) => {
    const {
        data: gatherings,
        isLoading,
        error,
        loadMore: fetchGatherings,
        refresh,
    } = usePaginatedQueryFetch<Gathering>('/gathering', 'query', query, ['gathering_name', 'place.name']);

    return {
        gatherings,
        isGatheringsLoading: isLoading,
        gatheringsError: error,
        fetchGatherings,
        refreshGatherings: refresh,
    };
};
