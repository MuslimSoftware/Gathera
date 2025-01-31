import React from 'react';
import { ChatRoomAddUsers } from '../components/ChatRoomAddUsers';
import { useConversation } from '../hooks/useConversation';
import { Loading } from '../../../shared/components/Core/Loading';

interface ChatRoomAddUsersContainer {
    route: any;
}

export const ChatRoomAddUsersContainer = ({ route }: ChatRoomAddUsersContainer) => {
    const { conversationId } = route.params;

    const { conversation, isLoading } = useConversation(conversationId);
    if (!conversation || isLoading) return <Loading />;

    return <ChatRoomAddUsers conversation={conversation} />;
};
