export type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface RequestConfig {
    url: string;
    method?: RequestMethod;
    headers?: any;
    body?: any;
}

export const DEFAULT_METHOD = 'GET';
export const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };
export const FETCH_TIMEOUT = 5000; // 5 seconds to wait for a response before trying again
export const MAX_FETCH_ATTEMPTS = 6; // 6 attempts in total (5 retries)
export const BACKEND_TIMEOUT_ERROR_MESSAGE = 'Connection timed out, please check your internet connection and try again.';

export const normalizeURL = (url: string) => {
    // Ensure the url starts with a slash
    if (!url.startsWith('/')) {
        url = `/${url}`;
    }

    // Ensure the url does not end with a slash
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }

    return url;
};

export const normalizeRequestConfig = (
    requestConfig: RequestConfig,
    isProtected: boolean | undefined,
    accessToken: string,
    isForeign: boolean = false
) => {
    if (isForeign) {
        return {
            url: requestConfig.url,
            method: requestConfig.method ? requestConfig.method : DEFAULT_METHOD,
            headers: requestConfig.headers,
            body: requestConfig.body,
        };
    }

    const method: any = requestConfig.method ? requestConfig.method : DEFAULT_METHOD;
    const headers: any = requestConfig.headers ? { ...DEFAULT_HEADERS, ...requestConfig.headers } : { ...DEFAULT_HEADERS };
    const body: any = requestConfig.body ? JSON.stringify(requestConfig.body) : null;

    if (isProtected && accessToken) {
        headers.Authorization = formatJWTHeader(accessToken);
    }

    return { url: normalizeURL(requestConfig.url), method, headers, body };
};

export const formatJWTHeader = (accessToken: string) => {
    return `Bearer ${accessToken}`;
};

export const logRequest = (url: string, method: string, isForeign: boolean = false) => {
    const baseUrl = isForeign ? '' : process.env.EXPO_PUBLIC_API_HOSTNAME;
    console.log(`${method} ${baseUrl}${url}`);
};

/**
 * @throws {Error}
 */
export const getResponse = async (requestConfig: RequestConfig, isForeign: boolean = false) => {
    logRequest(requestConfig.url, requestConfig.method!, isForeign);
    const TIMEOUT_ERROR_MESSAGE = 'timeout';

    let attemptNumber = 1;
    while (attemptNumber <= MAX_FETCH_ATTEMPTS) {
        try {
            const baseUrl = isForeign ? '' : process.env.EXPO_PUBLIC_API_HOSTNAME;
            const response: any = await Promise.race([
                fetch(`${baseUrl}${requestConfig.url}`, {
                    method: requestConfig.method,
                    headers: requestConfig.headers,
                    body: requestConfig.body,
                }),
                new Promise((_, reject) =>
                    setTimeout(() => {
                        reject(new Error(TIMEOUT_ERROR_MESSAGE));
                    }, FETCH_TIMEOUT)
                ),
            ]);

            if (!isForeign) {
                const data = await response.json().catch(() => {
                    // Response is not JSON --> Server must be down or something
                    throw new Error('Something went wrong. Please try again later.');
                });

                if (!response.ok) throw new Error(data.error || data.message);
                return data;
            }

            if (isForeign) {
                if (!response.ok) throw new Error('Something went wrong. Please try again later.');
                return response;
            }
        } catch (error: any) {
            if (error.message !== TIMEOUT_ERROR_MESSAGE) throw new Error(error.message);
            console.log(`${requestConfig.url}: Attempt ${attemptNumber} failed...`);
            attemptNumber++;
        }
    }

    throw new Error(BACKEND_TIMEOUT_ERROR_MESSAGE);
};
