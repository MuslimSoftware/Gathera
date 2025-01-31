import { validateString } from './Validators';
import { MAX_MESSAGE_LENGTH } from './../constants/messaging';

/**
 * Validates a message.
 * @param message The message to validate
 * @returns True if the message is valid, false otherwise
 */
export const validateMessage = (message: string): boolean => {
    return validateString(message) && message.length <= MAX_MESSAGE_LENGTH;
};
