import { usePlace } from './usePlace';
import { useInterestedUsers } from './useInterestedUsers';

export const usePlaceWithInterestedUsers = (place_id: string) => {
    const { isLoading: isLoadingPlace, error: errorPlace, fetchPlace, isInterested, setIsInterested } = usePlace(place_id);
    const { interestedUsers, setInterestedUsers, error: errorUsers, isLoading: isLoadingUsers, fetchUsers, refresh } = useInterestedUsers(place_id);

    return {
        isLoadingPlace,
        errorPlace,
        fetchPlace,
        interestedUsers,
        setInterestedUsers,
        errorUsers,
        isLoadingUsers,
        fetchUsers,
        refresh,
        isInterested,
        setIsInterested,
    };
};
