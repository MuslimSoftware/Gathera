import { useEffect, useState } from 'react';
import { useFetch } from '../../../shared/hooks/useFetch';
import { Conversation } from '../../../types/Inbox';
import { getConversationTitle } from '../../../shared/utils/Conversation';
import { getAuthContextValues } from '../../../shared/context/AuthContext';

export const useConversation = (conversationId: string) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const [conversation, setConversation] = useState<Conversation>();
    const [convoName, setConvoName] = useState<string>('');

    const { error, isLoading, fetchAsync } = useFetch();

    const fetchConversation = async () => {
        await fetchAsync({ url: `/conversation/get/${conversationId}` }, (data: any) => {
            const defaultConvoName = data.conversation_name.length > 0 ? data.conversation_name : getConversationTitle(data, userId);
            setConvoName(defaultConvoName);
            setConversation(data);
        });
    };

    useEffect(() => {
        fetchConversation();
    }, []);

    return { conversation, setConversation, convoName, setConvoName, error, isLoading, fetchConversation };
};
