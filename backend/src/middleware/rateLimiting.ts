import rateLimit from 'express-rate-limit';

export const rateLimiting = rateLimit({
    windowMs: 60 * 1000,
    max: 100, // # requests per windowMs
    handler: (_req, res) => {
        res.status(429).json({ message: 'Something went wrong, please try again later.' });
    },
});
