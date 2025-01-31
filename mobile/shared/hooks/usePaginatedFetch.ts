import { useState, useEffect } from 'react';
import { getResponse, normalizeRequestConfig } from '../utils/fetchHookUtils';
import { getAuthContextValues } from '../context/AuthContext';

interface PaginatedApiResponse<T> {
    data: T[];
    hasMore: boolean;
}

/**
 * This hook is used to make paginated HTTP GET requests to the backend in a standardized way
 * allowing for page, loading & error states to be handled in a consistent way.
 * **Note:** The url should be relative path: e.g. /user/details
 *
 * @param url the relative path to the endpoint
 * @param isProtected whether to attach bearer token to request
 */
export const usePaginatedFetch = <T>(url: string, isProtected: boolean = true) => {
    const { accessToken } = getAuthContextValues();
    const [data, setData] = useState<T[]>([]);
    const [_page, _setPage] = useState<number>(1);
    const [hasMore, _setHasMore] = useState<boolean>(true);
    const [isLoading, _setIsLoading] = useState<boolean>(true);
    const [error, _setError] = useState<string>('');
    const [_refreshKey, _setRefreshKey] = useState<number>(0);

    if (isProtected && !accessToken) {
        console.log('Trying to make a protected request without an access token. Request will not be sent.');
        return { data, setData, isLoading, error, loadMore: () => {}, hasMore, refresh: () => {} };
    }

    useEffect(() => {
        const fetchData = async () => {
            _setIsLoading(true);
            try {
                const config = normalizeRequestConfig({ url }, isProtected, accessToken);
                config.url.includes('?') ? (config.url += `&page=${_page}`) : (config.url += `?page=${_page}`);
                const response: PaginatedApiResponse<T> = await getResponse(config);

                // Artificial Delay
                // await new Promise((resolve) => setTimeout(resolve, 15000));

                setData((prev) => (_page === 1 ? response.data : prev.concat(response.data)));
                _setHasMore(response.hasMore);
                _setIsLoading(false);
            } catch (error: any) {
                _setError(error.message || 'Something went wrong!');
                _setIsLoading(false);
            }
        };

        fetchData();
    }, [_page, _refreshKey, url]);

    const loadMore = () => {
        hasMore && !isLoading && _setPage((prev) => prev + 1);
    };

    const refresh = () => {
        if (isLoading) return;

        _setHasMore(true);
        _setError('');
        _setPage(1);
        _setRefreshKey((prev) => prev + 1);
    };

    return { data, setData, isLoading, error, loadMore, hasMore, refresh };
};
