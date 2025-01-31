import { MAX_NOTIFICATION_CONTENT_LENGTH } from './../constants/notification';
import { NotificationType } from '../enums/notification';
import { validateString } from './Validators';

/**
 * Validates a notification's content
 * @param content The notification's content to validate
 * @returns True if the content is valid, false otherwise
 */
export const validateNotificationContent = (content: string): boolean => {
    return validateString(content) && content.length <= MAX_NOTIFICATION_CONTENT_LENGTH;
};

/**
 * Validates a notification's type
 * @param type The notification's type to validate
 * @returns True if the type is valid, false otherwise
 */
export const validateNotificationType = (type: string): boolean => {
    return Object.values(NotificationType).includes(type as NotificationType);
};
