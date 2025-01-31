import { MAX_CONVERSATION_NAME_LENGTH } from '../constants/messaging';
import { validateString } from './Validators';

/**
 * Validates a conversation name.
 * @param conversationName The conversation name to validate
 * @returns True if the conversation name is valid, false otherwise
 */
export const validateConversationName = (conversationName: any): boolean => {
    if (!validateString(conversationName)) return false;
    return conversationName.length <= MAX_CONVERSATION_NAME_LENGTH;
};
