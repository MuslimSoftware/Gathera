import { Socket, io } from 'socket.io-client';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { Dispatch, useState } from 'react';

let socket: Socket;

export const useChatSocket = (conversation: any, setMessages: Dispatch<any>) => {
    const {
        user: { _id: userId },
        accessToken,
    } = getAuthContextValues();
    const [isLoadingSendMessage, setIsLoadingSendMessage] = useState<boolean>(false);
    const [usersTyping, setUsersTyping] = useState<string[]>([]);

    const initSocket = () => {
        socket = io(process.env.EXPO_PUBLIC_API_HOSTNAME!, { auth: { token: accessToken, conversation_id: conversation._id } });

        socket.on(`message`, (data: any) => {
            setMessages((prevMessages: any) => [data, ...prevMessages]);
            setIsLoadingSendMessage(false); // TODO: Not technically correct since we don't know if the message was sent successfully
        });

        socket.on(`user-started-typing`, (typingUserId: any) => {
            if (userId == typingUserId) return;
            setUsersTyping((prev: any) => [...prev, typingUserId]);
        });

        socket.on(`user-stopped-typing`, (typingUserId: any) => {
            if (userId == typingUserId) return;
            setUsersTyping((prev: any) => prev.filter((userId: any) => userId != typingUserId));
        });
    };

    const sendMessage = (message: string) => {
        socket.emit('send-message', { message: message.trim() });
        setIsLoadingSendMessage(true);
    };

    const startedTyping = () => {
        socket.emit('started-typing');
    };

    const stoppedTyping = () => {
        socket.emit('stopped-typing');
    };

    const cleanupSocket = () => {
        stoppedTyping();
        socket.disconnect();
    };

    return {
        initSocket,
        sendMessage,
        startedTyping,
        stoppedTyping,
        cleanupSocket,
        isLoadingSendMessage,
        setIsLoadingSendMessage,
        usersTyping,
    };
};
