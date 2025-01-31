import { Conversation } from '../../types/Inbox';

/**
 * Gets the title of a conversation based on the users in the conversation as follows:
 * 1. If the conversation has a name, use that
 * 2. If the conversation has no name, join the other user's display name with a comma
 * @param conversation the conversation to get the title of
 * @param user_id the id of the authed user
 */
export const getConversationTitle = (conversation: Conversation, user_id: string) => {
    let title = '';

    if (conversation.conversation_name && conversation.conversation_name !== '') {
        title = conversation.conversation_name;
    } else {
        const otherUsers = conversation.users.filter((user) => user._id !== user_id);
        title = otherUsers
            .slice(0, 3)
            .map((user) => user.display_name)
            .join(', ');
        if (otherUsers.length > 3) {
            title += ' and ' + (otherUsers.length - 3) + ' others';
        }
    }

    if (title.length > 100) {
        title = title.substring(0, 97) + '...';
    }

    return title;
};
