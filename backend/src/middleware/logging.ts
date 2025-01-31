import { Request, Response, NextFunction } from 'express';
import consoleLog, { consoleLogColor, Colors } from '@utils/ConsoleLog';

const MAX_BODY_LENGTH = 0;

/**
 * Logging middleware that logs the request method & path, as well as the response body
 * **ONLY when res.json is called**.
 * @param req the request
 * @param res the response
 * @param next the next middleware
 */
const logging = (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;
    const originalRequestString = `${req.method} ${req.url}`;

    // Modify the json function to log the response body
    res.json = (body) => {
        let statusColor = Colors.GREEN;
        let isError = false;

        // 400 - 499 is yellow
        if (res.statusCode >= 400 && res.statusCode < 500) {
            statusColor = Colors.YELLOW;
            isError = true;
        }

        // 500 - 599 is red
        if (res.statusCode >= 500 && res.statusCode < 600) {
            statusColor = Colors.RED;
            isError = true;
        }

        // Set max length of body to 500 characters & log it
        let bodyString = JSON.stringify(body);
        const bodyLength = bodyString.length;
        if (!isError) {
            bodyString = JSON.stringify(body).slice(0, MAX_BODY_LENGTH);
        }
        if (bodyLength > MAX_BODY_LENGTH && MAX_BODY_LENGTH > 0) bodyString = bodyString + '...';
        if (statusColor !== Colors.GREEN) consoleLogColor(statusColor, `[${res.statusCode}] ${originalRequestString} \n${bodyString}`);

        return originalJson.call(res, body);
    };

    consoleLog(originalRequestString);
    next();
};

export default logging;
