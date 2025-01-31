import { Request, Response } from 'express';
import StatusError from '@utils/StatusError';
import { IUser, UserModel } from '@models/User/user';
import { generateJWT, decodeJWT } from '@utils/AuthToken';
import {
    validateDateOfBirth,
    validateEmail,
    validateGenderString,
    validateLastName,
    validateName,
    validatePhoneNumber,
} from '@lib/validators/UserValidators';
import { UserDetailsModel } from '@models/User/userDetails';
import { PRODUCTION } from '@config/env.config';
import { capitalizeAndTrim, formatPhoneNumber } from '@utils/formatters/authFormatting';
import { getUserInterestsAsync } from '@utils/InterestsHelper';
import { validateBoolean, validateDeviceInfo, validateString } from '@lib/validators/Validators';
import { UserSettingsModel } from '@models/User/userSettings';
import { JwtPayload } from 'jsonwebtoken';
import { UserAuthModel } from '@/models/User/userAuth';
import { THIRTY_SECONDS_MS, validateBodyFields } from '@/utils/validators/Validators';
import { sendPushNotificationToAdmins } from '@/config/push.config';
import { SESSION_EXPIRED_ERROR_MESSAGE } from '@/gathera-lib/constants/user';
import { getOTPFunctions } from '@/config/sms.config';
import { LRUCache } from '@/config/cache.config';

// Test phone numbers to not have to verify
const TEST_PHONE_NUMBERS: any = {
    '+15149999999': '135799',
    '+15149999998': '246800',
};

const OTP_CACHE = new LRUCache<number>(1000);
const { sendOTP, verifyOTP } = getOTPFunctions('messaging');

const ACCESS_TOKEN_EXPIRY = '6h';

/**
 * Login endpoint by phone #. Returns access token.
 * Can login with phone_number & otp or phone_number & otp_token.
 * @route /auth/login
 * @method POST
 * @requireAuth false
 * @return The user data, accessToken & refreshToken
 */
export const login = async (req: Request, res: Response) => {
    const { phone_number, otp, otp_token, device_info } = validateBodyFields(req.body, [
        // Required fields
        { field: 'phone_number', validator: validatePhoneNumber },
        // Optional fields
        { field: 'otp', validator: validateString, required: false }, // 6 digit OTP
        { field: 'otp_token', validator: validateString, required: false }, // JWT containing phone_number
        { field: 'device_info', validator: validateDeviceInfo, required: false },
    ]);

    if (!otp && !otp_token) throw new StatusError('Missing otp or otp_token.', 400);
    const { formattedPhoneNumber } = formatPhoneNumber(phone_number);

    // OTP verification only in production
    if (PRODUCTION) {
        const isTestAccount = TEST_PHONE_NUMBERS[formattedPhoneNumber] !== undefined;
        if (otp) {
            // If the phone number is a test account, use the provided OTP
            if (isTestAccount) {
                if (TEST_PHONE_NUMBERS[formattedPhoneNumber] !== otp) throw new StatusError('Invalid OTP. Use the provided code.', 400);
            } else {
                const validOTP = await verifyOTP(formattedPhoneNumber, otp);
                if (!validOTP) throw new StatusError('Invalid OTP.', 400);
            }
        } else if (otp_token) {
            const otpPayload = decodeJWT(otp_token) as JwtPayload;
            if (formattedPhoneNumber !== otpPayload.phone_number) throw new StatusError('Invalid OTP token. Please try again.', 400);
        }
    }

    // Get user
    const user = await UserModel.findOne({ phone_number: formattedPhoneNumber }).lean();
    if (!user) throw new StatusError('User not found.', 404);

    // Generate access & refresh tokens
    const accessToken: string = generateJWT({ id: user._id.toString() }, ACCESS_TOKEN_EXPIRY);
    const refreshToken: string = generateJWT({ id: user._id.toString(), refresh: true }, '100y');

    // Get user details, interests & auth
    const [details, interests] = await Promise.all([
        UserDetailsModel.findOne({ user: user._id }).select('-user').lean(),
        getUserInterestsAsync(user._id),
        UserAuthModel.deleteOne({ user: user._id }), // Delete existing auth for this user (only 1 auth per user permitted)
    ]);

    // Create new auth
    const authData: any = { user: user._id, ip_address: req.ip, refresh_token: refreshToken };
    if (device_info) authData.device_info = device_info;
    await UserAuthModel.create(authData);

    return res.status(200).json({ ...user, accessToken, refreshToken, interests, details });
};

/**
 * Signup endpoint by phone #. Returns access token & user data.
 * Must contain signup fields in body.
 * @route /auth/signup
 * @method POST
 * @requireAuth false
 * @return The user data with accessToken & refreshToken
 */
export const signup = async (req: Request, res: Response) => {
    let fields = validateBodyFields(req.body, [
        // Required fields
        { field: 'phone_number', validator: validatePhoneNumber },
        { field: 'fname', validator: validateName },
        { field: 'date_of_birth', validator: validateDateOfBirth },
        { field: 'gender', validator: validateGenderString },
        { field: 'otp_token', validator: validateString },
        // Optional fields
        { field: 'lname', validator: validateLastName, required: false },
        { field: 'email', validator: validateEmail, required: false },
        { field: 'is_subscribed_to_emails', validator: validateBoolean, required: false },
    ]);

    // Format fields
    fields.phone_number = formatPhoneNumber(fields.phone_number).formattedPhoneNumber;
    fields.fname = capitalizeAndTrim(fields.fname);
    let display_name = fields.fname;
    if (fields.lname) {
        fields.lname = capitalizeAndTrim(fields.lname);
        display_name += ` ${fields.lname}`;
    }
    if (fields.email) fields.email = fields.email.trim().toLowerCase();

    // Verify the phone number in the OTP token payload matches the phone number in the request
    const otpPayload = decodeJWT(fields.otp_token) as JwtPayload;
    if (fields.phone_number !== otpPayload.phone_number) throw new StatusError('Invalid OTP token. Please try again.', 400);

    // Check if user exists with phone_number OR email
    const query: any = [{ phone_number: fields.phone_number }];
    if (fields.email) query.push({ email: fields.email });
    if (await UserModel.findOne({ $or: query }).lean()) throw new StatusError('A user already exists with this phone number or email.', 400);

    // Combine user data
    const userData: any = {
        phone_number: fields.phone_number,
        fname: fields.fname,
        date_of_birth: fields.date_of_birth,
        gender: fields.gender,
        display_name,
    };
    if (fields.lname) userData.lname = capitalizeAndTrim(fields.lname);
    if (fields.email && fields.email.length > 0) userData.email = fields.email;

    // Create user
    const user = await UserModel.create(userData);
    if (!user) throw new StatusError('Failed to create user. Please try again.', 500);

    // Initialize user settings & details
    await Promise.all([
        UserSettingsModel.create({ user: user._id, is_subscribed_to_emails: fields.is_subscribed_to_emails, is_notifications_enabled: true }),
        UserDetailsModel.create({ user: user._id }),
    ]).catch(() => {
        // Delete all user data if failed to create user settings or details
        UserSettingsModel.deleteOne({ user: user._id });
        UserDetailsModel.deleteOne({ user: user._id });
        UserModel.findOneAndDelete({ _id: user._id });
        throw new StatusError('Failed to create user settings or details.', 500);
    });

    // send notification to admin
    sendPushNotificationToAdmins('New user signed up!', `${user.fname} ${user.lname}`, {
        picture_uri: user.avatar_uri,
        profileId: user._id,
        type: 'signup',
    });

    return login(req, res); // Redirect to login endpoint
};

/**
 * Refreshes the user's access token using a refresh token that is sent in the Authorization header.
 * A new access token is created and returned if the refresh token is valid.
 * @route /auth/refresh
 * @method POST
 * @requireRefresh true
 * @return The new access token.
 */
export const refresh = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']); // given by auth middleware
    if (!req.headers.authorization) throw new StatusError('Missing authorization header.', 400);

    const auth = await UserAuthModel.findOne({ user: user._id }).lean();
    if (!auth) throw new StatusError(SESSION_EXPIRED_ERROR_MESSAGE, 401);

    // Verify the refresh token that was sent in the Authorization header matches the refresh token in the database
    if (req.headers.authorization.replace('Bearer ', '') !== auth.refresh_token) throw new StatusError(SESSION_EXPIRED_ERROR_MESSAGE, 401);

    // Generate new access token
    const accessToken: string = generateJWT({ id: user._id.toString() }, ACCESS_TOKEN_EXPIRY);
    return res.status(200).json(accessToken);
};

/**
 * Logout endpoint. Invalidates & deletes the user's auth session related to the
 * refresh token that is sent in the Authorization header.
 * @route /auth/logout
 * @method POST
 * @requireRefresh true
 * @return Logout successful.
 */
export const logout = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']); // given by auth middleware
    if (!req.headers.authorization) throw new StatusError('Missing authorization header.', 400);

    const auth = await UserAuthModel.findOne({ user: user._id }).lean();
    if (!auth) throw new StatusError('User has no active auth sessions.', 400);

    // Verify the refresh token that was sent in the Authorization header matches the refresh token in the database
    if (req.headers.authorization.replace('Bearer ', '') !== auth.refresh_token)
        throw new StatusError('Your session has expired. Please login.', 401);

    // Delete auth session
    await UserAuthModel.deleteOne({ user: user._id });
    return res.status(200).json('Logout successful.');
};

/**
 * UserExists endpoint by phone_number or email.
 * @route /auth/user-exists
 * @method POST
 * @requireAuth false
 * @return True if user exists, false otherwise.
 */
export const userExists = async (req: Request, res: Response) => {
    let { phone_number, email } = validateBodyFields(req.body, [
        // Optional fields
        { field: 'phone_number', validator: validatePhoneNumber, required: false },
        { field: 'email', validator: validateEmail, required: false },
    ]);

    if (!phone_number && !email) throw new StatusError('Need either phone_number or email.', 400);
    const query: any = [];

    email && query.push({ email });
    phone_number && query.push({ phone_number: formatPhoneNumber(phone_number).formattedPhoneNumber });

    const user = await UserModel.exists({ $or: query }).lean();
    return res.status(200).json(!!user);
};

/**
 * Request an OTP for the specified phone number.
 * @route /auth/request-otp
 * @method POST
 * @requireAuth false
 * @return The OTP status.
 */
export const requestOTP = async (req: Request, res: Response) => {
    const { phone_number } = validateBodyFields(req.body, [
        // Required fields
        { field: 'phone_number', validator: validatePhoneNumber },
    ]);
    const { formattedPhoneNumber } = formatPhoneNumber(phone_number);

    if (!PRODUCTION) return res.status(200).json('Development mode. No OTP sent. Use any 6 characters as OTP.');
    if (TEST_PHONE_NUMBERS[formattedPhoneNumber] !== undefined) return res.status(200).json('Testing account. No OTP sent. Use provided OTP.');

    const clientIpAddress = req.ip || '';
    const numAttempts = OTP_CACHE.get(clientIpAddress) || 0;

    // Check if the client is spamming OTP requests
    if (numAttempts > 1) throw new StatusError('Too many OTP requests. Please try again later.', 429);

    // Add the client's IP address to the cache for 30 seconds
    OTP_CACHE.put(clientIpAddress, numAttempts + 1, new Date(Date.now() + THIRTY_SECONDS_MS));

    // Send OTP to phone number if in production
    const otp = await sendOTP(formattedPhoneNumber);
    if (!otp) throw new StatusError('Failed to send OTP.', 400);

    return res.status(200).json(otp.status);
};

/**
 * Validates an OTP for the specified phone number with Twilio if in Prod.
 * @route /auth/validate-otp
 * @method POST
 * @requireAuth false
 * @returns A valid OTP token if valid.
 */
export const validateOTP = async (req: Request, res: Response) => {
    const { phone_number, otp } = validateBodyFields(req.body, [
        // Required fields
        { field: 'phone_number', validator: validatePhoneNumber },
        { field: 'otp', validator: validateString },
    ]);
    const { formattedPhoneNumber } = formatPhoneNumber(phone_number);

    // OTP verification only in production
    if (PRODUCTION) {
        // If the phone number is a test account, use the provided OTP
        if (TEST_PHONE_NUMBERS[formattedPhoneNumber] !== undefined) {
            if (TEST_PHONE_NUMBERS[formattedPhoneNumber] !== otp) throw new StatusError('Invalid OTP. Use the provided code.', 400);
        } else {
            const validOTP = await verifyOTP(formattedPhoneNumber, otp);
            if (!validOTP) throw new StatusError('Invalid OTP.', 400);
        }
    }

    const validOTPToken = generateJWT({ phone_number: formattedPhoneNumber, OTP_valid: true }, '10m');
    return res.status(200).json(validOTPToken);
};
