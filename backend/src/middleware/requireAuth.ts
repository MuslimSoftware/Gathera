import { Request, Response, NextFunction } from 'express';
import StatusError from '@utils/StatusError';
import { JwtPayload } from 'jsonwebtoken';
import { UserModel } from '@models/User/user';
import { decodeJWT } from '@/utils/AuthToken';
import { UNAUTHORIZED_ERROR_MESSAGE, USER_DOES_NOT_EXIST_ERROR_MESSAGE } from '@/gathera-lib/constants/user';

/**
 * Require authentication middleware. All routes that require authentication should use this middleware.
 * Bearer token should be passed in the Authorization header. The token will be verified and user document will
 * be attached to the request body as req.body.user.
 * @param refreshOnly - If true, only refresh tokens will be allowed. If false, only access tokens will be allowed.
 */
const requireAuth = (refreshOnly: boolean = false) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const { authorization } = req.headers;
        if (!authorization) throw new StatusError('Authorization token required.', 401);

        // ensure that the content type is application/json
        if (req.headers['content-type'] !== 'application/json') throw new StatusError('Invalid Content-Type.', 400);

        // extract token from authorization header: "Bearer <token>" --> "<token>"
        const token = authorization.replace('Bearer ', '');
        try {
            const { id, refresh } = decodeJWT(token) as JwtPayload;

            if (refreshOnly && !refresh) throw new StatusError('Refresh token required.', 401);
            if (!refreshOnly && refresh) throw new StatusError('Refresh token cannot be used for this request.', 401);

            // verify if user exists
            UserModel.findById(id)
                .then((user) => {
                    if (!user) throw new StatusError(USER_DOES_NOT_EXIST_ERROR_MESSAGE, 401);

                    req.body.user = user; // attach user to request body
                    next();
                })
                .catch((err) => {
                    next(err);
                });
        } catch (error: any) {
            throw new StatusError(error.message || UNAUTHORIZED_ERROR_MESSAGE, 401);
        }
    };
};

export const requireRefresh = requireAuth(true);
export default requireAuth(false);
