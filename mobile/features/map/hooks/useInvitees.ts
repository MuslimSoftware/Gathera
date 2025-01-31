import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { UserPreview } from '../../../types/User';

export const useInvitees = () => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();

    const {
        isLoading,
        error,
        data: suggestedInvitees,
        setData: setSuggestedInvitees,
        loadMore: fetchInvitees,
        refresh,
    } = usePaginatedFetch<UserPreview>(`/user/profile/following/${userId}`);

    return { suggestedInvitees, setSuggestedInvitees, error, isLoading, fetchInvitees, refresh };
};
