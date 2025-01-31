import { useFetch } from '../../../shared/hooks/useFetch';

export const useHideConversation = (conversationId: string) => {
    const { error, isLoading, fetchAsync } = useFetch();

    const hideConversation = async () => {
        await fetchAsync({ url: `/conversation/hide/${conversationId}`, method: 'POST' }, () => {});
    };

    return { error, isLoading, hideConversation };
};
