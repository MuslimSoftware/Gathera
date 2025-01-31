import { Server } from 'socket.io';
import { PORT } from '@config/env.config';

interface SendMessageData {
    message: string;
}

/**
 * Handles the send-message event from the client and emits the response to the conversation
 * @param io the socket.io server
 * @param userData the user data in the socket of the user who sent the message
 * @param data the data sent from the client as a SendMessageData object
 */
export const sendMessageHandler = async (io: Server, userData: any, data: SendMessageData) => {
    const { userId, authToken, conversationId } = userData;
    const { message } = data;

    if (!userId || !authToken || !conversationId || !message) throw new Error('Missing user_id, auth_token, conversation_id, or message');

    const response = await fetch(`http://localhost:${PORT}/conversation/send-message/${conversationId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: authToken,
        },
        body: JSON.stringify({ message }),
    });

    const messageResponse = await response.json();
    if (!response.ok || !messageResponse) throw new Error(messageResponse.error || 'Not authorized');

    io.to(conversationId).emit('message', messageResponse);
};

/**
 * Handles the start-typing event from the client and emits the user_id of the user who started typing to the conversation
 * @param io the socket.io server
 * @param userData the user data in the socket of the user who started typing
 */
export const startedTypingHandler = async (io: Server, userData: any) => {
    const { userId, conversationId } = userData;
    if (!userId || !conversationId) throw new Error('Missing userId or conversationId');
    io.to(conversationId).emit('user-started-typing', userId);
};

/**
 * Handles the stopped-typing event from the client and emits user_id of the user who stopped typing to the conversation
 * @param io the socket.io server
 * @param data the user data in the socket of the user who stopped typing
 */
export const stoppedTypingHandler = async (io: Server, userData: any) => {
    const { userId, conversationId } = userData;
    if (!userId || !conversationId) throw new Error('Missing userId or conversationId');

    io.to(conversationId).emit('user-stopped-typing', userId);
};
