export interface PaginatedFetchResponse<T> {
    data: T[];
    hasMore: boolean;
}

type GetDataCallback<T> = (lowerBound: number, pageSize: number) => Promise<T[]>;

/**
 * Makes a paginated fetch request to the database. Assumes the page number is in the query as
 * "page" and starts at 1. If the page number is not a number or is less than 1, the page number
 * is set to 1.
 * @param reqQuery The query object from the request (e.g., req.query)
 * @param pageSize The number of items per page
 * @param getDataCallback The callback function that makes a paginated query to the database given a lower bound and page size
 * @returns The data and whether there is more data to fetch
 */
export const paginatedFetchAsync = async <T>(
    reqQuery: any,
    pageSize: number,
    getDataCallback: GetDataCallback<T>
): Promise<PaginatedFetchResponse<T>> => {
    const { lowerBound } = getPageFromQuery(reqQuery, pageSize);
    const data = await getDataCallback(lowerBound, pageSize + 1); // fetch one more than the page size to see if there is more data
    const hasMore = data.length > pageSize; // if there is more data than the page size, there is more data to fetch
    hasMore && data.pop(); // remove the extra data
    return { data, hasMore };
};

/**
 * Get the page number from the query and the lower and upper bounds of a page given the page number and page size. Page numbers start at 1.
 * If the page number is not a number or is less than 1, the page number is set to 1.
 * @param query The query object from the request
 * @returns The page number from the query and the lower and upper bounds of a page given the page number and page size. The lower bound is inclusive and the upper bound is exclusive.
 */
export const getPageFromQuery = (query: any, pageSize: number): { page: number; lowerBound: number; upperBound: number } => {
    let page = parseInt(query.page);
    if (isNaN(page) || page < 1) {
        page = 1;
    }

    const { lowerBound, upperBound } = getPageBounds(page, pageSize);
    return { page, lowerBound, upperBound };
};

/**
 * Get the lower and upper bounds of a page given the page number and page size. Page numbers start at 1.
 * @param page The page number
 * @param pageSize The number of items per page
 * @returns The lower and upper bounds of the page. The lower bound is inclusive and the upper bound is exclusive.
 */
const getPageBounds = (page: number, pageSize: number): { lowerBound: number; upperBound: number } => {
    const lowerBound = (page - 1) * pageSize;
    const upperBound = page * pageSize;
    return { lowerBound, upperBound };
};
