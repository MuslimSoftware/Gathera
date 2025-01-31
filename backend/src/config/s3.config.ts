import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AWS_REGION, AWS_S3_GATHERING_PICTURES_BUCKET_NAME, AWS_S3_PROFILE_PICTURES_BUCKET_NAME } from '@config/env.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { FIVE_MINUTES_MS } from '@/utils/validators/Validators';
import StatusError from '@/utils/StatusError';

let client: S3Client = new S3Client({
    region: AWS_REGION,
});

/**
 * Gets a pre-signed url for uploading a file to S3
 * @param filename filename that will be set in S3
 * @param bucket bucket to upload to
 * @returns pre-signed url
 */
export const getUploadUrlAsync = async (filename: string, bucket: string): Promise<string> => {
    try {
        const command = new PutObjectCommand({ Bucket: bucket, Key: filename, ContentType: 'image/jpeg' });
        const ttl = (FIVE_MINUTES_MS / 1000) * 3; // 15 minutes
        return await getSignedUrl(client, command, { expiresIn: ttl });
    } catch (error) {
        console.log(error);
        throw new StatusError('Error getting pre-signed url', 500);
    }
};

/**
 * Deletes a file from S3
 * @param filename name of the file to delete
 * @param bucket name of the bucket to delete from
 * @returns response | null
 */
export const deleteFileAsync = async (filename: string, bucket: string) => {
    const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: filename,
    });

    try {
        const response = await client.send(command);
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};

/**
 * Generates a full url to retrieve a file from S3
 * @param filename name of the file
 * @param bucket bucket of the file
 * @returns url to retrieve the file
 */
export const getS3Url = (filename: string, bucket: string) => {
    return `https://${bucket}.s3.amazonaws.com/${filename}`;
};

/**
 * Generates a full url to retrieve a profile picture from the profile pictures S3 bucket
 * @param filename name file to retrieve
 * @returns url to retrieve the file
 */
export const getProfilePictureUrl = (filename: string) => {
    return getS3Url(filename, AWS_S3_PROFILE_PICTURES_BUCKET_NAME);
};

/**
 * Generates a full url to retrieve a gathering picture from the gathering pictures S3 bucket
 * @param filename name file to retrieve
 * @returns url to retrieve the file
 */
export const getGatheringPictureUrl = (filename: string) => {
    return getS3Url(filename, AWS_S3_GATHERING_PICTURES_BUCKET_NAME);
};

/**
 * Gets the filename from a S3 url (e.g. https://bucket.s3.amazonaws.com/filename)
 * @param url The S3 url to get the filename from
 * @returns The filename
 */
export const getFilenameFromS3Url = (url: string): string => {
    return url.split('/').pop() || '';
};
