import mongoose from 'mongoose';
import StatusError from '../StatusError';

export const FIFTEEN_SECONDS_MS = 15000;
export const THIRTY_SECONDS_MS = 30000;
export const ONE_MINUTE_MS = 60000;
export const FIVE_MINUTES_MS = 300000;
export const THIRTY_MINUTES_MS = 1800000;
export const ONE_HOUR_MS = 3600000;
export const TWELVE_HOURS_MS = 43200000;
export const ONE_DAY_MS = 86400000;
export const SEVEN_DAYS_MS = 604800000;
export const THIRTY_DAYS_MS = 2592000000;

type Validator = (value: any) => boolean;
interface BodyFieldValidationConfig {
    field: string; // The required field name (e.g. 'email')

    validator?: Validator | Validator[]; // The validator function(s) to validate the field value (e.g. validateEmail)
    required?: boolean; // Whether the field is required. Defaulted to true. (e.g. 'lname' is optional, but 'email' is required)
}

/**
 * Validates if all required fields are in the request body. If any are missing, throws an error.
 * Optionally, if a validator is provided, it will be used to validate the field.
 * @param body The request body (e.g. req.body)
 * @param bodyFields The body fields to validate (e.g. ['email', 'password'] or [{ field: 'email', validator: validateEmail }])
 * @returns An object with the required fields and their values (e.g. { email: 'test@test', password: 'test' }).
 * It is equivalent to req.body, so you can use it as you would req.body.:
 *
 * const { email, password } = validateBodyFields(req.body, ['email', 'password']);
 */
export const validateBodyFields = (body: any, bodyFields: (string | BodyFieldValidationConfig)[]) => {
    if (!bodyFields || bodyFields.length === 0) return; // if no required fields, return

    const missingFields: string[] = [];
    for (const field of bodyFields) {
        if (typeof field === 'string') {
            // current field is a string (e.g. 'email'), so no validator & required is defaulted to true
            body[field] === undefined && missingFields.push(field);
        } else {
            // current field is an object (e.g. { field: 'email', validator: validateEmail, required: true })
            if (body[field.field] === undefined) {
                // the field is not in the body, so check if it's required or not (defaulted to true)
                if (field.required === undefined || field.required === true) missingFields.push(field.field);
            } else {
                // the field is in the body, so check if the value is valid or not (if a validator is provided)
                if (field.validator) {
                    const validators = Array.isArray(field.validator) ? field.validator : [field.validator]; // put the validator(s) in an array if it's not already

                    // run each validator on the field value
                    for (const validator of validators) {
                        if (!validator(body[field.field])) {
                            // the validator failed, so throw an error
                            const name = field.field;
                            const value = body[field.field];
                            throw new StatusError(
                                `Invalid ${name.replace(/_/g, ' ')}: ${typeof value === 'string' ? value : JSON.stringify(value)}`,
                                400
                            );
                        }
                    }
                }
            }
        }
    }

    if (missingFields.length > 0) throw new StatusError(`Missing required field(s): ${missingFields.join(', ')}`, 400);
    return body;
};

/**
 * Validates an ObjectId.
 * @param id the ObjectId to validate
 * @returns true if the ObjectId is valid, false otherwise
 */
export const validateObjectId = (id: string) => {
    return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Compares two object ids
 * @param id1 The first object id
 * @param id2 The second object id
 * @returns boolean if the two object ids are the same
 */
export const compareObjectIds = (id1: any, id2: any): boolean => {
    return id1.toString() === id2.toString();
};
