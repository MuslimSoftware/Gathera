import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { useFetch } from '../../../shared/hooks/useFetch';

export const useUpcomingGatherings = () => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const { error: upcomingGatheringsError, isLoading: isUpcomingGatheringsLoading, fetchAsync } = useFetch();

    const getUpcomingGatherings = async (onSuccess: (data: any) => void) => {
        await fetchAsync({ url: `/gathering/user/${userId}` }, onSuccess);
    };

    return { upcomingGatheringsError, isUpcomingGatheringsLoading, getUpcomingGatherings };
};
