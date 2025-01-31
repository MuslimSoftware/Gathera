import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useConversations } from '../hooks/useConversations';
import Conversations from '../components/Conversations';
import { useFocusEffect } from '@react-navigation/native';

export const ConversationsContainer = React.memo(({}: any) => {
    const { conversations, setConversations, error, isLoading, fetchMoreConversations, refreshConversations } = useConversations();
    const [shouldRefreshConversations, setShouldRefreshConversations] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            setShouldRefreshConversations(true);
        }, [])
    );

    useEffect(() => {
        if (shouldRefreshConversations) {
            refreshConversations();
            setShouldRefreshConversations(false);
        }
    }, [shouldRefreshConversations, refreshConversations]);

    return (
        <Conversations
            conversations={conversations}
            setConversations={setConversations}
            error={error}
            isLoading={isLoading}
            fetchMoreConversations={fetchMoreConversations}
            refreshConversations={refreshConversations}
        />
    );
});

const styles = StyleSheet.create({});
