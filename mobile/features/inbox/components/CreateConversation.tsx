import React from 'react';
import { UserSelectorScreen } from '../../../shared/components/UserSelectorScreen';
import { useFetch } from '../../../shared/hooks/useFetch';

interface CreateConversationProps {
    navigation: any;
}

export const CreateConversation = ({ navigation }: CreateConversationProps) => {
    const { fetchAsync, error, isLoading } = useFetch();

    const createConversation = async (selectedUsers: Array<any>) => {
        fetchAsync(
            {
                url: `/conversation/create`,
                method: 'POST',
                body: { users: selectedUsers },
            },
            (createdConversation) => {
                if (createdConversation?._id) {
                    navigation.replace('ChatRoom', { conversationId: createdConversation._id });
                } else {
                    // @TODO: handle case where conversation was not created
                    navigation.replace('Conversations', { conversation: createdConversation });
                }
            }
        );
    };

    return <UserSelectorScreen onSubmit={createConversation} submitLabel='Create' title='Create Conversation' error={error} isLoading={isLoading} />;
};
