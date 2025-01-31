import { validateString } from './Validators';
import { MAX_PLACE_NAME_LENGTH, MIN_PLACE_NAME_LENGTH, MAX_GOOGLE_PLACE_ID_LENGTH } from './../constants/place';

/**
 * Validates place name
 * @param name The place name to validate
 * @returns true if the name is valid, false otherwise
 */
export const validatePlaceName = (name: string): boolean => {
    return validateString(name) && name.length <= MAX_PLACE_NAME_LENGTH && name.length >= MIN_PLACE_NAME_LENGTH;
};

/**
 * Validates google place id
 * @param googlePlaceId The google place id to validate
 * @returns true if the google_place_id is valid, false otherwise
 */
export const validateGooglePlaceId = (googlePlaceId: string): boolean => {
    return validateString(googlePlaceId) && googlePlaceId.length <= MAX_GOOGLE_PLACE_ID_LENGTH;
};
