import React from 'react';
import ChatRoom, { ChatRoomSkeleton } from '../components/ChatRoom';
import { useConversation } from '../hooks/useConversation';
import { ErrorMessage } from '../../../shared/components/ErrorMessage';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { RefreshControl, ScrollView } from 'react-native';

interface ChatRoomContainerProps {
    route: any;
}

export const ChatRoomContainer = ({ route }: ChatRoomContainerProps) => {
    const { conversationId } = route.params;
    const { conversation, isLoading: isConversationLoading, fetchConversation, error } = useConversation(conversationId);

    if (error) {
        return (
            <HeaderPageLayout>
                <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={fetchConversation} />}>
                    <ErrorMessage message={error} />
                </ScrollView>
            </HeaderPageLayout>
        );
    }

    if (!conversation || isConversationLoading) {
        return <ChatRoomSkeleton />;
    }

    return <ChatRoom conversation={conversation} />;
};
