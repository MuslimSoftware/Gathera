import React from 'react';
import { UserSelectorScreen } from '../../../shared/components/UserSelectorScreen';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { useFetch } from '../../../shared/hooks/useFetch';

interface ChatRoomAddUsersProps {
    conversation: any;
}

export const ChatRoomAddUsers = ({ conversation }: ChatRoomAddUsersProps) => {
    const { navigateToScreen } = useNavigate();
    const { fetchAsync, error, isLoading } = useFetch();

    const addUsersToConversation = async (selectedUsers: Array<any>) => {
        fetchAsync(
            {
                url: `/conversation/add-users/${conversation._id}`,
                method: 'POST',
                body: { users_to_add: selectedUsers },
            },
            (updatedConversation) => {
                if (updatedConversation?._id) {
                    navigateToScreen('ChatRoom', { conversationId: updatedConversation._id });
                } else {
                    // @TODO: handle case where conversation was not created
                    navigateToScreen('Conversations');
                }
            }
        );
    };

    return (
        <UserSelectorScreen
            userFilter={conversation.users}
            onSubmit={addUsersToConversation}
            submitLabel='Add'
            title='Add Users'
            error={error}
            isLoading={isLoading}
        />
    );
};
