import { consoleLogError, consoleLogWarning } from '@utils/ConsoleLog';
import dotenv from 'dotenv';

dotenv.config();

// PORT
if (!process.env.PORT || process.env.PORT === '') consoleLogWarning('PORT not set in env file, using default port 3000');
export const PORT = process.env.PORT || 3000;

// PRODUCTION
if (!process.env.PRODUCTION || process.env.PRODUCTION === '') consoleLogWarning('PRODUCTION not set in env file, using default value false');
export const PRODUCTION = process.env.PRODUCTION === 'true';

// MONGO DB URI
if (!process.env.MONGODB_URI) {
    consoleLogError('MONGODB_URI not set in env file. Please set it and try again.');
    process.exit(1);
}
export const MONGODB_URI = process.env.MONGODB_URI as string;

// API SECRET
if (!process.env.ADMIN_SECRET_KEY) {
    consoleLogError('ADMIN_SECRET_KEY not set in env file. Please set it and try again.');
    process.exit(1);
}
export const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY as string;

// JWT SECRET
if (!process.env.JWT_SECRET_KEY) {
    consoleLogError('JWT_SECRET_KEY not set in env file. Please set it and try again.');
    process.exit(1);
}
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

// METRICS AUTH KEY
if (!process.env.METRICS_AUTH_KEY_BASE64) {
    consoleLogError('METRICS_AUTH_KEY_BASE64 not set in env file. Please set it and try again.');
    process.exit(1);
}
export const METRICS_AUTH_KEY_BASE64 = process.env.METRICS_AUTH_KEY_BASE64 as string;

// GOOGLE MAPS API KEY
if (!process.env.GOOGLE_MAPS_API_KEY) {
    consoleLogError('GOOGLE_MAPS_API_KEY not set in env file. Please set it and try again.');
    process.exit(1);
}
export const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY as string;

// TWILIO ACCOUNT SID
if (!process.env.TWILIO_ACCOUNT_SID) {
    consoleLogError('TWILIO_ACCOUNT_SID not set in env file. Please set it and try again.');
    process.exit(1);
}
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID as string;

// TWILIO AUTH TOKEN
if (!process.env.TWILIO_AUTH_TOKEN) {
    consoleLogError('TWILIO_AUTH_TOKEN not set in env file. Please set it and try again.');
    process.exit(1);
}
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN as string;

// TWILIO VERIFY SERVICE SID
if (!process.env.TWILIO_VERIFY_SERVICE_SID) {
    consoleLogError('TWILIO_VERIFY_SERVICE_SID not set in env file. Please set it and try again.');
    process.exit(1);
}
export const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID as string;

// TWILIO MESSAGING SERVICE SID
if (!process.env.TWILIO_MESSAGING_SERVICE_SID) {
    consoleLogError('TWILIO_MESSAGING_SERVICE_SID not set in env file. Please set it and try again.');
    process.exit(1);
}
export const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID as string;

// AWS S3 REGION
if (!process.env.AWS_REGION) {
    consoleLogError('AWS_REGION not set in env file. Please set it and try again.');
    process.exit(1);
}
export const AWS_REGION = process.env.AWS_REGION as string;

// AWS S3 PROFILE PICTURES BUCKET NAME
if (!process.env.AWS_S3_PROFILE_PICTURES_BUCKET_NAME) {
    consoleLogError('AWS_S3_PROFILE_PICTURES_BUCKET_NAME not set in env file. Please set it and try again.');
    process.exit(1);
}
export const AWS_S3_PROFILE_PICTURES_BUCKET_NAME = process.env.AWS_S3_PROFILE_PICTURES_BUCKET_NAME as string;

// AWS S3 GATHERING PICTURES BUCKET NAME
if (!process.env.AWS_S3_GATHERING_PICTURES_BUCKET_NAME) {
    consoleLogError('AWS_S3_GATHERING_PICTURES_BUCKET_NAME not set in env file. Please set it and try again.');
    process.exit(1);
}
export const AWS_S3_GATHERING_PICTURES_BUCKET_NAME = process.env.AWS_S3_GATHERING_PICTURES_BUCKET_NAME as string;

// REVENUE CAT AUTH KEY
if (!process.env.REVENUE_CAT_AUTH_KEY) {
    consoleLogError('REVENUE_CAT_AUTH_KEY not set in env file. Please set it and try again.');
    process.exit(1);
}
export const REVENUE_CAT_AUTH_KEY = process.env.REVENUE_CAT_AUTH_KEY as string;

export default {};
