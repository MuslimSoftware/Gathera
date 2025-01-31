import { Server, Socket } from 'socket.io';
import { JWT_SECRET_KEY, PORT } from '@config/env.config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { consoleLogError } from '@utils/ConsoleLog';

export const initChatSocket = async (socket: Socket) => {
    const authToken = socket.handshake.auth.token;
    const conversationId = socket.handshake.auth.conversation_id;

    if (!authToken || !conversationId || typeof authToken !== 'string' || typeof conversationId !== 'string')
        throw new Error('Missing auth_token or conversation_id');

    const { id: userId } = jwt.verify(authToken, JWT_SECRET_KEY) as JwtPayload;

    // attach data to socket
    socket.data.userId = userId;
    socket.data.authToken = authToken;
    socket.data.conversationId = conversationId;

    // verify user is in conversation
    const response = await fetch(`http://localhost:${PORT}/conversation/get/${conversationId}`, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
        },
    });

    const conversation = await response.json();
    if (!response.ok || !conversation) throw new Error(conversation.error || 'Not authorized');

    await socket.join(conversationId); // join conversation room
};

export const disconnectChatSocket = async (io: Server, socket: Socket) => {
    const { userId, conversationId } = socket.data;
    if (!conversationId) throw new Error('Missing conversation_id');

    io.to(conversationId).emit('user-stopped-typing', userId);
    await socket.leave(conversationId); // leave conversation room
};

export const socketErrorHandler = (error: any, socket: Socket) => {
    consoleLogError(`[WS] ${error.message}`);
    socket.disconnect();
};
