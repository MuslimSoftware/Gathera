import { useMemo } from 'react';
import { WithId, filterArray, filterArrayDuplicates } from '../utils/dataHelper';
import { usePaginatedFetch } from './usePaginatedFetch';

/**
 * NOTE: DATA MUST HAVE _id PROPERTY
 * This query hook is used to fetch paginated data from the server and filters duplicated data.
 * @param url The relative path to the endpoint
 * @param queryField The query field to filter by
 * @param query The query value to filter by
 * @param filterFields The field(s) to filter by if different from queryField (optional) if not provided, queryField will be used
 * @param isProtected Whether to attach bearer token to request
 * @returns Unique elements array
 */
export const usePaginatedQueryFetch = <T extends WithId>(
    url: string,
    queryField: string,
    query: string,
    filterFields?: string | string[],
    isProtected: boolean = true
) => {
    const { data, isLoading, error, loadMore, refresh } = usePaginatedFetch<T>(`${url}?${queryField}=${query}`, isProtected);
    const filteredData: T[] = useMemo(() => {
        const uniqueElements = filterArrayDuplicates<T>(data);
        return filterArray(uniqueElements, query, filterFields || queryField);
    }, [data]);

    return {
        data: filteredData,
        isLoading,
        error,
        loadMore,
        refresh,
    };
};
