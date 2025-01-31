import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { Gathering } from '../../../types/Gathering';

export const useUserGatherings = (user_id: string) => {
    const {
        data: gatherings,
        error,
        isLoading,
        loadMore: fetchGatherings,
        setData: setGatherings,
        refresh,
    } = usePaginatedFetch<Gathering>(`/gathering/user/${user_id}`);

    return { gatherings: gatherings as Gathering[], error, isLoading, setGatherings, fetchGatherings, refresh };
};
