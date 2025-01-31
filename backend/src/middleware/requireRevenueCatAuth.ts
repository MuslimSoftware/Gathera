import { REVENUE_CAT_AUTH_KEY } from '@/config/env.config';
import { consoleLogError } from '@/utils/ConsoleLog';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to authenticate RevenueCat webhook requests.
 * Also validates the request body to ensure it contains the necessary event data.
 * It attaches the user_id to the request object for use in the controller.
 */
export const requireRevenueCatAuth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;
    if (!authorization || authorization !== REVENUE_CAT_AUTH_KEY) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const { event } = req.body;
    if (!event) {
        // TODO: Event not found in request body --> alert the team
        consoleLogError('RevenueCat event not found in request body.');
        console.log(req.body);
        throw new Error('RevenueCat event not found in request body.');
    }

    const { app_user_id: user_id } = event;
    if (!user_id) {
        // TODO: User ID not found in event --> alert the team
        consoleLogError('RevenueCat event does not contain user_id for user subscription.');
        console.log(event);
        throw new Error('RevenueCat event does not contain user_id for user subscription.');
    }

    // Attach user_id to request body object
    req.body.user_id = user_id;
    next();
};
