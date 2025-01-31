import { RequestConfig, getResponse, normalizeRequestConfig } from './../utils/fetchHookUtils';
import { useCallback, useState } from 'react';
import { getAuthContextValues } from '../context/AuthContext';

type DataResponseHandler = (data: any) => void;

/**
 * This hook is used to make HTTP requests with standardized error handling and loading state.
 * @param isProtected Whether the request should be protected with an access token, defaults to true (protected). Should be false for requests to foreign servers.
 * @param isForeign Whether the request should be made to a foreign server, defaults to false (not foreign).
 * @returns isLoading, error, setError, fetchAsync
 */
export const useFetch = (isProtected: boolean = true, isForeign: boolean = false) => {
    if (isProtected && isForeign) throw new Error('You should not make a protected request to a foreign server');

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { accessToken } = getAuthContextValues();

    /**
     * This makes the actual request and handles the loading state and error handling.
     * @param requestConfig The request config object (url, method, headers, body)
     * @param onSuccess The callback function to be called on success with the response data
     */
    const fetchAsync = useCallback(
        async (requestConfig: RequestConfig, onSuccess: DataResponseHandler) => {
            if (isProtected && !accessToken) throw new Error('Trying to make a protected request without an access token. Request will not be sent.');

            const config = normalizeRequestConfig(requestConfig, isProtected, accessToken, isForeign);
            setIsLoading(true);
            setError('');

            try {
                const data = await getResponse(config, isForeign);
                onSuccess(data);
            } catch (err: any) {
                const errorMessage = err.message || 'Something went wrong!';
                setError(errorMessage);
            }
            setIsLoading(false);
        },
        [accessToken, isForeign, isProtected]
    );

    return { isLoading, error, setError, fetchAsync };
};
