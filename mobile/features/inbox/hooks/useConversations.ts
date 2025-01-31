import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';
import { Conversation } from '../../../types/Inbox';

export const useConversations = () => {
    const {
        error,
        isLoading,
        data: conversations,
        setData: setConversations,
        loadMore: fetchMoreConversations,
        refresh: refreshConversations,
    } = usePaginatedFetch<Conversation>('/conversation');

    return { conversations, setConversations, error, isLoading, fetchMoreConversations, refreshConversations };
};
