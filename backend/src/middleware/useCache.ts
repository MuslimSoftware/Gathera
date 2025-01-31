import { Request, Response, NextFunction } from 'express';
import { CACHE_DEFAULT_TTL, getFromCache, putInCache } from '@config/cache.config';

/**
 * Use cache middleware. This middleware will check if the request is cached and if so, return the cached response
 * if the cached data is not expired. If the request is not cached, it will be passed to the next middleware.
 *
 * **Note**: To use this middleware, you must call the `useCache` function and pass it the TTL (time to live) in
 * milliseconds. e.g., router.get('/', useCache(1000), getPlaces); will cache the response for 1 second.
 */
export const useCache = (ttl: number = CACHE_DEFAULT_TTL) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const fullUrl = `${req.method} ${req.originalUrl}`;
        const cachedResponse = getFromCache(fullUrl);
        if (cachedResponse) return res.status(200).json(cachedResponse);
        const originalJson = res.json;

        // Modify the json function to cache the response body
        res.json = (body: any) => {
            if (res.statusCode > 399) return originalJson.call(res, body);
            // Cache the response body
            putInCache(fullUrl, body, new Date(Date.now() + ttl));
            return originalJson.call(res, body);
        };

        next();
    };
};

// Default cache instance. TTL is set to 12 hours.
export const defaultCache = useCache();
