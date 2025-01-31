import { parsePhoneNumber } from 'libphonenumber-js';
import StatusError from '@utils/StatusError';

/**
 * Formats phone number to E.164 format.
 * @param phone_number
 * @returns { metaData: any, formattedNumber: string}
 */
export const formatPhoneNumber = (phone_number: string) => {
    try {
        const parsedNumber = parsePhoneNumber(phone_number);

        return { metaData: parsedNumber, formattedPhoneNumber: parsedNumber.format('E.164').trim() };
    } catch (err: any) {
        throw new StatusError(`Invalid phone number: ${phone_number}`, 400);
    }
};

/**
 * Removes beggining and trailing whitespaces, then autocapitalizes the first letter
 * of each word in a string. Ex: '   hello world   ' -> 'Hello World'
 * @param str The string to format.
 * @returns The formatted string.
 */
export const capitalizeAndTrim = (str: string) => {
    const trimmed = str.trim();
    const words = trimmed.split(' ');
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return capitalizedWords.join(' ');
};
