import { useState } from 'react';
import { useQueryUsers } from './useQueryUsers';
import { useQueryGatherings } from './useQueryGatherings';
import { useQueryPlaces } from './useQueryPlaces';

export const useQuery = () => {
    const [query, setQuery] = useState('');
    const [queryDebounced, setQueryDebounced] = useState('');
    const [timeoutId, setTimeoutId] = useState<any>(null);

    const setQueryDebouncedFn = (query: string) => {
        setQuery(query);
        clearTimeout(timeoutId);

        const timeout = setTimeout(() => {
            setQueryDebounced(query);
        }, 100);

        setTimeoutId(timeout);
    };

    const { users, isUsersLoading, usersError, fetchUsers, refreshUsers } = useQueryUsers(queryDebounced);
    const { gatherings, isGatheringsLoading, gatheringsError, fetchGatherings, refreshGatherings } = useQueryGatherings(queryDebounced);
    const { places, isPlacesLoading, placesError, fetchPlaces, refreshPlaces } = useQueryPlaces(queryDebounced);

    return {
        query,
        setQuery: setQueryDebouncedFn,
        users,
        isUsersLoading,
        usersError,
        gatherings,
        isGatheringsLoading,
        gatheringsError,
        places,
        isPlacesLoading,
        placesError,
        fetchUsers,
        fetchGatherings,
        fetchPlaces,
        refreshUsers,
        refreshGatherings,
        refreshPlaces,
    };
};
