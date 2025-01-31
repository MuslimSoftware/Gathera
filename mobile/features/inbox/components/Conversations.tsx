import { StyleSheet } from 'react-native';
import React from 'react';
import ConversationItem, { ConversationItemSkeleton } from './ConversationItem';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { CreateIcon } from '../../../shared/components/Core/Icons';
import { PaginatedList } from '../../../shared/components/Core/PaginatedList';
import { useNavigate } from '../../../shared/hooks/useNavigate';

interface ConversationsProps {
    fetchMoreConversations: () => void;
    refreshConversations: () => void;
    error: string | null | undefined;
    conversations: any;
    isLoading: boolean;
    setConversations: any;
}

const Conversations = React.memo(
    ({ fetchMoreConversations, refreshConversations, error, conversations, isLoading, setConversations }: ConversationsProps) => {
        const { navigateToScreen } = useNavigate();

        const navigateToCreateConversation = () => {
            navigateToScreen('CreateConversation');
        };

        return (
            <HeaderPageLayout title='Inbox' headerRight={<CreateIcon onPress={navigateToCreateConversation} />}>
                <PaginatedList
                    data={conversations}
                    isLoading={isLoading}
                    refresh={refreshConversations}
                    renderItem={({ item }) => (
                        <ConversationItem
                            conversation={item}
                            removeConversation={() => setConversations((prev: any) => prev.filter((convo: any) => convo._id !== item._id))}
                        />
                    )}
                    renderSkeletonItem={ConversationItemSkeleton}
                    numSkeletonItemsToRender={10}
                    error={error}
                    onEndReached={fetchMoreConversations}
                    contentContainerStyle={styles.conversationsContent}
                    dataName='conversations'
                />
            </HeaderPageLayout>
        );
    }
);

export default Conversations;

const styles = StyleSheet.create({
    conversationsContent: {
        paddingVertical: 5,
        paddingRight: 10,
        paddingLeft: 7.5,
    },
});
