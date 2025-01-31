import { useFetch } from '../../../shared/hooks/useFetch';
import { validateImageBase64 } from '../../../gathera-lib/validators/Validators';
import { base64ToBuffer } from '../../../shared/utils/dataHelper';
import { useMemo } from 'react';

/**
 * Uploads a base64 image to S3
 * @param base64Image The base64 image to upload to S3. Use the base64ToBuffer function to convert a base64 string to a buffer.
 * @param presignedUrlEndpoint The endpoint URL from the backend which returns a presigned url (GET) & stores the updated filename in the database (POST).
 * @param onSuccess A callback function to call when the image is successfully uploaded to S3.
 */
export const useUploadToS3 = (base64Image: string, presignedUrlEndpoint: string, onSuccess?: () => void) => {
    const { fetchAsync, error, isLoading } = useFetch();
    const { fetchAsync: fetchUploadToS3, error: fetchUploadToS3Error, isLoading: isFetchUploadToS3Loading } = useFetch(false, true);
    const imageBuffer = useMemo(() => base64ToBuffer(base64Image), [base64Image]);

    const uploadToS3 = async (presignedUrl: string, filename: string) => {
        if (!presignedUrl) {
            console.log('Cannot upload to S3 without a presigned url');
            return;
        }

        if (!base64Image || !validateImageBase64(base64Image)) {
            console.log('Cannot upload to S3 without a valid base64 image');
            return;
        }

        await fetchUploadToS3(
            {
                url: presignedUrl,
                method: 'PUT',
                headers: { 'Content-Length': base64Image.length.toString(), 'Content-Type': 'image/jpeg' },
                body: imageBuffer,
            },
            (data) => {
                console.log('Successfully uploaded to S3');
                console.log('Notifying server of upload...');
                notifyServerOfUpload(filename);
            }
        );
    };

    const uploadImage = async () => {
        await fetchAsync({ url: presignedUrlEndpoint }, async (response) => {
            const { filename, url } = response;
            await uploadToS3(url, filename);
        });
    };

    const notifyServerOfUpload = async (filename: string) => {
        if (!filename) {
            console.log('Cannot notify server of upload without a filename');
            return;
        }

        await fetchAsync({ url: presignedUrlEndpoint, method: 'POST', body: { filename } }, (data) => {
            console.log('Successfully notified server of upload');
            onSuccess && onSuccess();
        });
    };

    return {
        uploadImage,
        error: error || fetchUploadToS3Error,
        isLoading: isLoading || isFetchUploadToS3Loading,
    };
};
