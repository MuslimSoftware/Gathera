import { Request, Response, NextFunction } from 'express';
import StatusError from '@utils/StatusError';
import mongoose from 'mongoose';
import { MongoServerSelectionError } from 'mongodb';

/**
 * Error handling middleware that catches errors for all endpoints and
 * sends a standardized error response to the client.
 */
const errorHandling = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    let status = 500;
    let message = 'Something went wrong.';

    if (err instanceof StatusError) {
        status = err.status;
        message = err.message;
    } else if (err instanceof SyntaxError) {
        // happens when JSON.parse() fails --> invalid JSON
        status = 400;
        message = 'Invalid JSON syntax.';
    } else if (err instanceof mongoose.Error.CastError) {
        // happens when query with invalid object id format
        console.log(err);
        status = 400;
        message = 'Invalid Object ID.';
    } else if (err instanceof MongoServerSelectionError) {
        // happens when server cannot connect to database (e.g., network is down)
        console.error(err);
        status = 500;
        message = "We're having network issues. Try again later.";
    } else {
        console.error(err);
    }

    res.status(status).json({ error: message });
};

export default errorHandling;
