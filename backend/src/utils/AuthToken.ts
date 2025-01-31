import jwt, { VerifyOptions } from 'jsonwebtoken';
import StatusError from '@utils/StatusError';
import { JWT_SECRET_KEY } from '@config/env.config';

type Payload = string | Object | Buffer;

/**
 * Generates a signed JWT.
 * @param payload The payload of the JWT.
 * @param expiresIn time in seconds, or a string describing a time span Eg: 60, "2 days", "10h", "7d"
 * @throws `StatusError` if error occurs while generating JWT
 * @returns signed JWT
 */
export const generateJWT = (payload: Payload, expiresIn: string | number = '7d'): string => {
    try {
        return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn });
    } catch (error: any) {
        throw new StatusError('Generating token failed', 500);
    }
};

/**
 * Verifies a JWT.
 * @param token signed JWT
 * @param options JWT verification options
 * @throws `StatusError` if error occurs while verifying JWT
 * @returns payload of the JWT
 */
export const decodeJWT = (token: string, options?: VerifyOptions) => {
    try {
        return jwt.verify(token, JWT_SECRET_KEY, options);
    } catch (error: any) {
        // @TODO: this is also used for OTPS so this error message is not appropriate
        throw new StatusError('Your session has expired. Please re-login and try again.', 403);
    }
};
