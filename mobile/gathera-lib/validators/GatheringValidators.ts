import {
    MAX_GATHERING_COUNT,
    MAX_GATHERING_DESCRIPTION_LENGTH,
    MAX_GATHERING_NAME_LENGTH,
    MIN_GATHERING_COUNT,
    MIN_GATHERING_NAME_LENGTH,
} from './../constants/gathering';
import { validateString } from './Validators';
import { validateFutureDate, validateInteger } from './Validators';

/**
 * Validates a max gathering count.
 * @param maxCount the max count to validate
 * @returns true if the max count is valid (2 <= int <= 8), false otherwise
 */
export const validateMaxGatheringCount = (maxCount: any): boolean => {
    if (!validateInteger(`${maxCount}`)) return false;
    maxCount = parseInt(maxCount);
    return maxCount >= MIN_GATHERING_COUNT && maxCount <= MAX_GATHERING_COUNT;
};

/**
 * Validates a gathering name length.
 * @param gatheringName The gathering name to validate
 * @returns True if the gathering name is valid, false otherwise
 */
export const validateGatheringName = (gatheringName: any): boolean => {
    if (!validateString(gatheringName)) return false;
    return gatheringName && gatheringName.length >= MIN_GATHERING_NAME_LENGTH && gatheringName.length <= MAX_GATHERING_NAME_LENGTH;
};

/**
 * Validates a gathering description length.
 * @param gatheringDesc The gathering description to validate
 * @returns True if the gathering description is valid, false otherwise
 */
export const validateGatheringDescription = (gatheringDesc: any): boolean => {
    if (!validateString(gatheringDesc)) return false;

    return gatheringDesc.length <= MAX_GATHERING_DESCRIPTION_LENGTH;
};

/**
 * Validates a gathering event date.
 * @param eventDate The gathering event date to validate
 * @returns True if the event date is valid, false otherwise
 */
export const validateGatheringEventDate = (eventDate: Date): boolean => {
    if (!eventDate) return false;
    if (typeof eventDate === 'string') eventDate = new Date(eventDate);

    return validateFutureDate(eventDate);
};
