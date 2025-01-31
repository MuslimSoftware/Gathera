import { Message } from '../../../types/Inbox';
import { usePaginatedFetch } from '../../../shared/hooks/usePaginatedFetch';

export const useMessages = (conversation_id: string) => {
    const { data, setData, isLoading, error, loadMore, refresh, hasMore } = usePaginatedFetch<Message>(`/conversation/messages/${conversation_id}`);

    return {
        messages: data as Message[],
        setMessages: setData as React.Dispatch<React.SetStateAction<Message[]>>,
        isLoading,
        error,
        loadMore,
        refresh,
        isAtEnd: hasMore,
    };
};
