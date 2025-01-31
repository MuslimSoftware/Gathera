import { StyleSheet } from 'react-native';
import React from 'react';
import { useConversation } from '../hooks/useConversation';
import ChatRoomSettings from '../components/ChatRoomSettings';
import { Loading } from '../../../shared/components/Core/Loading';

export const ChatRoomSettingsContainer = ({ route }: any) => {
    const { conversationId } = route.params;
    const { conversation, convoName, setConvoName, isLoading, error } = useConversation(conversationId);

    if (!conversation || isLoading) return <Loading />;

    return <ChatRoomSettings conversation={conversation} convoName={convoName} setConvoName={setConvoName} />;
};

const styles = StyleSheet.create({});
