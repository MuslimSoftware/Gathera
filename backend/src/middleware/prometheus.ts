import { Express, NextFunction, Request, Response } from 'express';
import prometheusMiddleware from 'express-prometheus-middleware';
import { METRICS_AUTH_KEY_BASE64 } from '@/config/env.config';

/**
 * Get Prometheus middleware for collecting metrics on the API. This middleware
 * will collect metrics for all routes except those that are excluded.
 * @param app The Express app instance
 * @returns The Prometheus metrics middleware
 */
export const getPrometheusMiddleware = (app: Express) => {
    const metricsMiddleware = prometheusMiddleware({
        metricsPath: '/metrics',
        metricsApp: app,
        collectDefaultMetrics: true,
        requestDurationBuckets: [0.1, 0.5, 1, 1.5],
        requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
        responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
        authenticate: (req) => req.headers.authorization === `Basic ${METRICS_AUTH_KEY_BASE64}`,
    });

    return (req: Request, res: Response, next: NextFunction) => {
        const EXCLUDED_PATHS = ['admin']; // Paths to exclude from Prometheus metrics collection (e.g. admin routes)
        const basePath = req.path.split('/')[1];

        if (EXCLUDED_PATHS.includes(basePath)) {
            return next(); // Skip sending to Prometheus and proceed to the next middleware
        } else {
            return metricsMiddleware(req, res, next); // Send to Prometheus middleware for metrics collection
        }
    };
};
