import validator from 'validator';
import { DeviceType } from '../enums/user';

export const validateNotNullUndefined = (value: any) => {
    return value !== null && value !== undefined;
};

/**
 * Validates a string to make sure its of type string.
 * @param string the string to validate
 * @returns true if string, false otherwise
 */
export const validateString = (string: string) => {
    return typeof string === 'string';
};

/**
 * Validates a url string.
 * @param url the url to validate
 * @returns true if the url is valid, false otherwise
 */
export const validateImageUrl = (url: string) => {
    return validator.isURL(url);
};

/**
 * Validates whether an image is base64.
 * @param image the image to validate
 * @returns true if the image is base64, false otherwise
 */
export const validateImageBase64 = (image: any) => {
    return validator.isBase64(image);
};

/**
 * Validates an integer.
 * @param value the value to validate
 * @returns true if the value is a valid integer, false otherwise
 */
export const validateInteger = (value: string): boolean => {
    return validator.isInt(value);
};

/**
 * Validates a future date.
 * @param date the date to validate
 * @returns true if the date is in the futue, false otherwise
 */
export const validateFutureDate = (date: Date): boolean => {
    const now = new Date();
    return validateDate(date) && date > now;
};

/**
 * Validates a date.
 * @param date
 * @returns true if the date is valid, false otherwise
 */
export const validateDate = (date: Date): boolean => {
    return date.getTime && !isNaN(date.getTime());
};

/**
 * Validates a boolean
 * @param bool the boolean to validate
 * @returns true/false if it is a boolean
 */
export const validateBoolean = (bool: string): boolean => {
    return typeof bool === 'boolean';
};

/**
 * Validates an array
 * @param array the array to validate
 * @returns true/false if it is an array
 */
export const validateArray = (array: any): boolean => {
    return Array.isArray(array);
};

/**
 * Validates device info. Every key must be a string and must be in the whitelist of allowed keys.
 * @param deviceInfo the device info to validate
 * @returns true/false if the device info is valid
 */
export const validateDeviceInfo = (deviceInfo: any) => {
    if (!validateNotNullUndefined(deviceInfo) || typeof deviceInfo !== 'object') return false;

    // Must match the DeviceInfo interface in gathera-lib/types/user.ts
    const deviceInfoWhitelist = ['device_name', 'device_type', 'device_model', 'device_os', 'device_os_version'];

    for (const key of Object.keys(deviceInfo)) {
        if (typeof deviceInfo[key] !== 'string') return false;
        if (!validateNotNullUndefined(deviceInfo[key])) return false;
        if (!deviceInfoWhitelist.includes(key)) return false; // A key is not in the whitelist of allowed keys
        if (deviceInfo[key].length > 255) return false; // Value is too long

        if (key === 'device_type' && !Object.values(DeviceType).includes(deviceInfo[key])) return false; // device_type is not a valid DeviceType
    }

    return true;
};

/**
 * Validates two device infos to make sure they have the same values.
 * @param deviceInfo1 The first device info
 * @param deviceInfo2 The second device info
 * @returns True if the device infos are the same, false otherwise
 */
export const validateSameDeviceInfo = (deviceInfo1: any, deviceInfo2: any) => {
    if (!validateDeviceInfo(deviceInfo1) || !validateDeviceInfo(deviceInfo2)) return false;

    for (const key of Object.keys(deviceInfo1)) {
        if (deviceInfo1[key] !== deviceInfo2[key]) return false;
    }

    return true;
};
