import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { Notification } from '../../../types/Notification';

export const useNotifications = (type?: string) => {
    const { data, error, setData, loadMore, refresh, isLoading } = usePaginatedFetch<Notification>(`/notification${type ? `?type=${type}` : ''}`);

    return {
        notifications: data,
        error,
        setNotifications: setData,
        fetchNotifications: loadMore,
        refreshNotifications: refresh,
        isLoading,
    };
};
