import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from '@config/db.config';
import errorHandling from '@middleware/errorHandling';
import logging from '@middleware/logging';
import { consoleLogSuccess } from '@utils/ConsoleLog';
import { PORT, PRODUCTION } from '@config/env.config';
import apiRoutes from '@routes/apiRoutes';
import { rateLimiting } from '@middleware/rateLimiting';
import { disconnectChatSocket, initChatSocket, socketErrorHandler } from '@websocket/chatSocket';
import { sendMessageHandler, startedTypingHandler, stoppedTypingHandler } from '@websocket/messaging';
import { getPrometheusMiddleware } from './middleware/prometheus';

// <--------------------- INITIALIZE APP --------------------->

const app = express();

// <------------------- REGISTER MIDDLEWARE ------------------>

// Prometheus metrics middleware
PRODUCTION && app.use(getPrometheusMiddleware(app));

// Logging middleware
PRODUCTION && app.use(morgan('combined')); // Use standard logging on production
!PRODUCTION && app.use(logging); // Use custom logging middleware on development

// Rate limit middleware
app.set('trust proxy', true); // Enable trust proxy to get client IP address behind ALB
PRODUCTION && app.use(rateLimiting); // Use rate limiting on production only

app.use(cors());
app.use(express.json({ limit: '100kb' })); // JSON parsing

// <--------------------- REGISTER ROUTES -------------------->

// Register root route for health check
app.get('/', (_req, res) => {
    return res.status(200).json('Gathera API');
});

// Register all API routes
app.use('/', apiRoutes);

// Register 404 middleware
app.use((_req, res, _next) => {
    return res.status(404).json({ error: 'Not found.' });
});

// Register error handling middleware
app.use(errorHandling);

// <--------------------- START THE SERVER ------------------->

// Connect to database
connectDB().then(() => {
    // Start the HTTP server
    const server = app.listen(PORT, () => {
        consoleLogSuccess(`${PRODUCTION ? 'Production' : 'Development'} server running on port ${PORT}.`);
    });

    // Create WebSocket server
    const io: Server = new Server(server, { cors: { origin: '*' } });

    // Define WebSocket event handlers
    io.on('connection', (socket) => {
        initChatSocket(socket).catch((error) => socketErrorHandler(error, socket));

        socket.on('send-message', (data) => sendMessageHandler(io, socket.data, data).catch((error) => socketErrorHandler(error, socket)));
        socket.on('started-typing', () => startedTypingHandler(io, socket.data).catch((error) => socketErrorHandler(error, socket)));
        socket.on('stopped-typing', () => stoppedTypingHandler(io, socket.data).catch((error) => socketErrorHandler(error, socket)));

        socket.on('disconnect', () => {
            disconnectChatSocket(io, socket).catch((error) => socketErrorHandler(error, socket));
        });
    });
});
