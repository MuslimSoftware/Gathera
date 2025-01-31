import { Request, Response, NextFunction } from 'express';
import { IUser } from '@models/User/user';
import StatusError from '@utils/StatusError';
import { SubscriptionType } from '@lib/enums/user';
import { validateBodyFields } from '@/utils/validators/Validators';

/**
 * Require subscription middleware. This middleware will check if the user is subscribed to a premium plan.
 * If the user is not subscribed to a premium plan, it will return a 403 error.
 * **Note**: This middleware must be used after the requireAuth middleware.
 * @requireAuth true
 */
export const requireSubscription = (req: Request, _res: Response, next: NextFunction) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    if (!user) throw new StatusError('Request is not authorized.', 401);

    if (!user.subscription || user.subscription === SubscriptionType.FREE) throw new StatusError('You must be premium to use this feature.', 403);

    return next();
};
