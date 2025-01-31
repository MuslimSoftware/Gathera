import { OtpModel } from '@/models/otp';
import { consoleLogError } from '@/utils/ConsoleLog';
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_MESSAGING_SERVICE_SID, TWILIO_VERIFY_SERVICE_SID } from '@config/env.config';

type OTPService = 'verify' | 'messaging';

export const getOTPFunctions = (serviceToUse: OTPService) => {
    switch (serviceToUse) {
        case 'verify':
            return {
                sendOTP: sendOTPWithVerifyService,
                verifyOTP: verifyOTPWithVerifyService,
            };
        case 'messaging':
            return {
                sendOTP: sendOTPWithMessagingService,
                verifyOTP: verifyOTPWithMessagingService,
            };
        default:
            return {
                sendOTP: sendOTPWithVerifyService,
                verifyOTP: verifyOTPWithVerifyService,
            };
    }
};

const twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Sends an OTP to the specified phone number using Twilio's Verify Service.
 * @param phoneNumber The phone number to send the OTP to in E.164 format. See https://www.twilio.com/docs/glossary/what-e164 for more information.
 * @returns The response from Twilio.
 */
const sendOTPWithVerifyService = async (phoneNumber: string) => {
    try {
        const response = await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verifications.create({
            to: phoneNumber,
            channel: 'sms',
        });

        return response;
    } catch (error: any) {
        consoleLogError(error);
        return null;
    }
};

/**
 * Verifies an OTP for the specified phone number using Twilio's Verify Service.
 * @param phoneNumber The phone number to verify the OTP for in E.164 format. See https://www.twilio.com/docs/glossary/what-e164 for more information.
 * @param code The OTP code to verify.
 * @returns Whether or not the OTP is valid.
 */
const verifyOTPWithVerifyService = async (phoneNumber: string, code: string): Promise<boolean> => {
    try {
        const response = await twilioClient.verify.v2.services(TWILIO_VERIFY_SERVICE_SID).verificationChecks.create({
            to: phoneNumber,
            code: code,
        });

        return response.status === 'approved';
    } catch (error: any) {
        consoleLogError(error);
        return false;
    }
};

/**
 * Sends an OTP to the specified phone number using Twilio's Messaging Service.
 * @param phoneNumber The phone number to send the OTP to in E.164 format. See https://www.twilio.com/docs/glossary/what-e164 for more information.
 * @returns The response from Twilio.
 */
const sendOTPWithMessagingService = async (phoneNumber: string) => {
    try {
        // Generate a random 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Store the OTP in the database for verification
        await OtpModel.create({
            phone_number: phoneNumber,
            code: otp,
        });

        // Send the OTP to the specified phone number
        const response = await twilioClient.messages.create({
            body: `Your Gathera code is ${otp}`,
            messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
            to: phoneNumber,
        });

        return response;
    } catch (error: any) {
        consoleLogError(error);
        return null;
    }
};

/**
 * Verifies an OTP for the specified phone number that used Twilio's Messaging Service.
 * @param phoneNumber The phone number to verify the OTP for in E.164 format. See https://www.twilio.com/docs/glossary/what-e164 for more information.
 * @param code The OTP code to verify.
 * @returns Whether or not the OTP is valid.
 */
const verifyOTPWithMessagingService = async (phoneNumber: string, code: string): Promise<boolean> => {
    try {
        // Find the OTP in the database
        const otp = await OtpModel.findOne({ phone_number: phoneNumber, code });

        // If the OTP is valid, delete it from the database and return true
        if (otp) {
            await OtpModel.deleteMany({ phone_number: phoneNumber }); // Delete all OTPs for the phone number
            return true;
        }

        // Otherwise, return false
        return false;
    } catch (error: any) {
        consoleLogError(error);
        return false;
    }
};

/**
 * Determines whether or not the specified phone number is valid.
 * @param phoneNumber The phone number to lookup in E.164 format. See https://www.twilio.com/docs/glossary/what-e164 for more information.
 * @returns Whether or not the phone number is valid.
 */
export const lookupPhoneNumber = async (phoneNumber: string) => {
    try {
        const response = await twilioClient.lookups.v2.phoneNumbers(phoneNumber).fetch();
        return response.valid;
    } catch (error: any) {
        consoleLogError(error);
        return false;
    }
};
