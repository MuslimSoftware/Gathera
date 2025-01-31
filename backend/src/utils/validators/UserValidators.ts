import { InterestModel } from '@/models/User/interest';
import Expo from 'expo-server-sdk';

/**
 * Validates a list of interest names to make sure they are valid.
 * @param interests
 * @returns true if all interests are valid, false otherwise
 */
export const validateInterests = async (interests: string[]) => {
    if (!Array.isArray(interests)) {
        return false;
    }

    try {
        const interestDocuments = await InterestModel.find({ name: { $in: interests } }).lean();
        if (interestDocuments.length !== interests.length) return false;
    } catch (err) {
        return false;
    }

    // Check if all elements of the array are of type string
    return interests.every((item) => typeof item === 'string');
};

/**
 * Validates a push token. A push token is valid if it is an empty string or a valid Expo push token.
 * @param token The push token to validate
 * @returns true if the push token is valid, false otherwise
 */
export const validatePushToken = (token: string) => {
    return token === '' || Expo.isExpoPushToken(token);
};
