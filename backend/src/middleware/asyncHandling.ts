import { Request, Response, NextFunction, Router } from 'express';

const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const asyncHandlingDFS = (router: Router) => {
    router.stack.forEach((layer) => {
        if (layer.route) {
            layer.route.stack.forEach((handler: any) => {
                handler.handle = asyncHandler(handler.handle); // Wrap each handler in asyncHandler to catch errors
            });
        } else if (layer.name === 'router') {
            asyncHandlingDFS(layer.handle);
        }
    });
};
