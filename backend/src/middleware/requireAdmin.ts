import { Request, Response, NextFunction } from 'express';
import StatusError from '@utils/StatusError';
import { ADMIN_SECRET_KEY } from '@config/env.config';

/**
 * Require admin middleware. All routes that require admin should use this middleware.
 * Secret should be passed in the headers. The secret will be verified and the next function will be called.
 */
export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
    const { secret } = req.headers;
    if (!secret) throw new StatusError('Secret is required in headers.', 401);
    if (secret !== ADMIN_SECRET_KEY) throw new StatusError('Invalid Admin Secret.', 403);

    next();
};
