import validator from 'validator';
import { parsePhoneNumber } from 'libphonenumber-js';
import { validateArray, validateBoolean, validateNotNullUndefined, validateString } from './Validators';
import { ReportReason } from '../enums/report';
import { UserBorder, Gender } from '../enums/user';
import {
    MAX_BIO_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_INSTAGRAM_USERNAME_LENGTH,
    MAX_NAME_LENGTH,
    MAX_PHONE_NUMBER_LENGTH,
    MAX_REPORT_DESCRIPTION_LENGTH,
    MIN_REPORT_DESCRIPTION_LENGTH,
    NATIONALITIES,
} from '../constants/user';

/**
 * Validates a border.
 * @param border The border to validate
 * @returns True if the border is valid, false otherwise
 */
export const validateBorder = (border: string) => {
    return Object.values(UserBorder).includes(border as UserBorder);
};

/**
 * Validates a phone number.
 * @param phoneNumber the phone number to validate
 * @returns true if the phone number is valid, false otherwise
 */
export const validatePhoneNumber = (phoneNumber: string) => {
    if (!validateNotNullUndefined(phoneNumber) || phoneNumber.length > MAX_PHONE_NUMBER_LENGTH) return false;

    try {
        const parsedNumber = parsePhoneNumber(phoneNumber);
        return parsedNumber.isValid();
    } catch (err: any) {
        return false;
    }
};

/**
 * Validates a date of birth.
 * @param date_of_birth the date of birth to validate
 * @returns true if the date of birth is valid, false otherwise
 */
export const validateDateOfBirth = (date_of_birth: string | Date) => {
    if (!validateNotNullUndefined(date_of_birth)) return false;

    let formattedDate: Date;
    if (typeof date_of_birth === 'string') formattedDate = new Date(date_of_birth);
    else formattedDate = date_of_birth;

    if (formattedDate.toString() === 'Invalid Date') return false;
    if (!validator.isISO8601(formattedDate.toISOString(), { strict: true })) return false;

    const currentYear: number = new Date().getFullYear();
    const inputtedYear: number = formattedDate.getFullYear();
    const minValidYear = currentYear - 18; // Minimum valid year: current year minus 18
    if (!formattedDate || inputtedYear > currentYear || inputtedYear > minValidYear || inputtedYear < 1920 || formattedDate.getTime() > Date.now())
        return false;

    return true;
};

/**
 * Validates an email.
 * @param email the email to validate
 * @returns true if the email is valid, false otherwise
 */
export const validateEmail = (email: string) => {
    if (!validateNotNullUndefined(email) || email.length > MAX_EMAIL_LENGTH) return false;

    return validator.isEmail(email);
};

/**
 * Validates a gender.
 * @param gender the gender to validate
 * @returns true if the gender is valid, false otherwise
 */
export const validateGenderString = (gender: string) => {
    return Object.values(Gender).includes(gender as Gender);
};

/**
 * Validates a bio.
 * @param bio the bio to validate
 * @returns true if the bio is valid, false otherwise
 */
export const validateBio = (bio: string) => {
    return validateNotNullUndefined(bio) && validateString(bio) && bio.length <= MAX_BIO_LENGTH;
};

/**
 * Validates a report reason.
 * @param reason the reason to validate
 * @returns true if the reason is valid, false otherwise
 */
export const validateReportReason = (reason: string) => {
    return Object.values(ReportReason).includes(reason as ReportReason);
};

/**
 * Validates a report description
 * @param description The report description to validate
 * @returns true if the description is valid, false otherwise
 */
export const validateReportDescription = (description: string): boolean => {
    return (
        validateNotNullUndefined(description) &&
        validateString(description) &&
        description.length <= MAX_REPORT_DESCRIPTION_LENGTH &&
        description.length >= MIN_REPORT_DESCRIPTION_LENGTH
    );
};

/**
 * Determines whether a height is within acceptable range and format.
 * @param height the height to validate
 * @returns if height is valid
 */
export const validateHeight = (height: string) => {
    if (!validateNotNullUndefined(height)) return false;

    const possibleHeights = Array.from({ length: 8 }, (_, i) => {
        const height = `${i + 1}'`;
        const inches = Array.from({ length: 12 }, (_, i) => `${i}"`);
        return inches.map((inch) => `${height}${inch}`);
    }).flat();

    return possibleHeights.includes(height);
};

/**
 * Validates a name as follows:
 * 
 * English letters (both uppercase and lowercase): A-Z and a-z 
 * Accented letters used in various European languages, including À-Ö, Ø-ö, and ø-ÿ
 * Cyrillic letters: \u0400-\u04FF and \u0500-\u052F
 * Japanese hiragana: \u3040-\u309F
 * Japanese katakana: \u30A0-\u30FF
 * Chinese characters: \u4E00-\u9FFF
 * Korean Hangul syllables: \uAC00-\uD7AF
 * Arabic characters: \u0600-\u06FF
 * Apostrophe, hyphen and space

 * @param inputString the name to validate 
 * @returns true if the name is valid, false otherwise
 */
const isValidName = (inputString: string) => {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\u0400-\u04FF\u0500-\u052F\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF\u0600-\u06FF '’‘-]+$/;
    return regex.test(inputString);
};

/**
 * Validates a name by making sure it is between 1 and 50 characters and only contains letters, spaces, and hyphens.
 * @param name the name to validate
 * @returns true if the name is valid, false otherwise
 * @note this function allows spaces and hyphens, use this for display_name
 */
export const validateDisplayName = (name: string) => {
    if (!validateNotNullUndefined(name)) return false;

    const maxDisplayNameLength = MAX_NAME_LENGTH * 2 + 1;
    if (name.length > maxDisplayNameLength || name.length < 1) return false;

    return isValidName(name);
};

/**
 * Validates a name.
 * @param name the name to validate
 * @returns true if the name is valid, false otherwise
 * @note use this for fname
 */
export const validateName = (name: string) => {
    return validateNotNullUndefined(name) && name.length >= 1 && validateLastName(name);
};

/**
 * Validates a name. Ignores spaces.
 * @param name the name to validate
 * @returns true if the name is valid, false otherwise
 * @note use this for lname
 */
export const validateLastName = (name: string) => {
    if (!validateNotNullUndefined(name) || name.length > MAX_NAME_LENGTH) return false;

    return isValidName(name);
};

/**
 * Validates an Instagram username.
 * @param username the username to validate
 * @returns true if the username is valid, false otherwise
 */
export const validateInstagramUsername = (username: string) => {
    return validateNotNullUndefined(username) && validateString(username) && username.length <= MAX_INSTAGRAM_USERNAME_LENGTH;
};

/**
 * Validates whether a given userSettings field is in the expected format
 * @param field the field to validate
 * @param value the value to validate
 * @returns true if the field/value is valid, false otherwise
 */
export const validateUserSettingField = (field: string, value: any) => {
    const fieldWhiteList = ['is_notifications_enabled', 'is_subscribed_to_emails'];

    if (!fieldWhiteList.includes(field)) return false;

    switch (field) {
        case 'is_notifications_enabled':
        case 'is_subscribed_to_emails':
            return validateBoolean(value);
        default:
            return false;
    }
};

/**
 * Validates a nationalities array.
 * @param nationalities The nationalities array to validate
 * @returns True if the nationalities array is valid, false otherwise
 */
export const validateNationalities = (nationalities: string[]): boolean => {
    if (!validateArray(nationalities)) return false;

    // Check if all nationalities are in the set of valid nationalities
    return nationalities.every((nationality: string) => NATIONALITIES.has(nationality));
};
