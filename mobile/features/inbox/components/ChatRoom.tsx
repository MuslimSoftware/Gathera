import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useRef, useEffect } from 'react';
import MessageItem, { MessageItemRightSkeleton, MessageItemSkeleton } from './MessageItem';
import MessageInput from './MessageInput';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { getConversationTitle } from '../../../shared/utils/Conversation';
import { GearsIcon } from '../../../shared/components/Core/Icons';
import { HeaderPageLayout } from '../../../shared/layouts/HeaderPageLayout';
import { FlatList } from 'react-native-gesture-handler';
import { ConversationSummary } from './ConversationSummary';
import { useMessages } from '../hooks/useMessages';
import { useChatSocket } from '../hooks/useChatSocket';
import { useNavigate } from '../../../shared/hooks/useNavigate';
import { ellipsizeText } from '../../../shared/utils/uiHelper';
import { getAuthContextValues } from '../../../shared/context/AuthContext';

interface ChatRoomProps {
    conversation: any;
}

const ChatRoom = ({ conversation }: ChatRoomProps) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const { navigateToScreen } = useNavigate();
    const scrollViewRef = useRef<any>();
    const insets = useSafeAreaInsets();
    const { messages, setMessages, isLoading, error, loadMore: fetchMoreMessages, isAtEnd } = useMessages(conversation._id);
    const { initSocket, cleanupSocket, isLoadingSendMessage, sendMessage, setIsLoadingSendMessage, startedTyping, stoppedTyping, usersTyping } =
        useChatSocket(conversation, setMessages);

    useEffect(() => {
        initSocket();
        return cleanupSocket;
    }, [conversation._id]);

    const scrollToBottom = () => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToOffset({
                animated: true,
                offset: 0,
            });
        }
    };

    const navigateToSettings = () => {
        if (conversation.gathering) {
            navigateToScreen('GatheringSettings', { gatheringId: conversation.gathering._id });
            return;
        } else {
            navigateToScreen('ChatRoomSettings', { conversationId: conversation._id });
            return;
        }
    };

    const onTitlePress = () => {
        if (conversation.gathering) {
            navigateToScreen('Gathering', { gatheringId: conversation.gathering._id ?? conversation.gathering });
            return;
        }

        if (conversation.users.length > 2) {
            navigateToSettings();
            return;
        }

        if (conversation.users.length == 2) {
            const otherUserId = conversation.users.find((u: any) => u._id != userId)._id;
            navigateToScreen('OtherProfile', { profileId: otherUserId });
            return;
        }
    };

    const otherAvatarUris = conversation.gathering
        ? [conversation.gathering.gathering_pic]
        : conversation.users.filter((u: any) => u._id != userId).map((u: any) => u.avatar_uri);
    const convoName = getConversationTitle(conversation, userId);
    const summaryText = `${conversation.users.length} members`;

    const FooterComponent = () => {
        if (isLoading) return null;
        if (!isAtEnd && messages.length > 10) return null;
        if (error) return <Text>Error loading messages</Text>;

        return (
            <ConversationSummary
                avatarUris={otherAvatarUris}
                convoName={convoName}
                isGathering={conversation.gathering != null}
                usersLength={conversation.users.length}
                summaryText={summaryText}
                onPress={onTitlePress}
            />
        );
    };

    const renderItem = ({ item }: { item: any }) => {
        return <MessageItem key={item._id} message={item} users={conversation.users} />;
    };

    let typingUserDisplayName = '';
    if (usersTyping.length === 1) {
        const typingUser = conversation.users.find((u: any) => u._id == usersTyping[0]);
        if (typingUser) typingUserDisplayName = ellipsizeText(typingUser.display_name, 25) + ' is typing...';
        else typingUserDisplayName = 'Someone is typing...';
    } else if (usersTyping.length > 1) typingUserDisplayName = 'Multiple people are typing...';

    return (
        <HeaderPageLayout
            title={getConversationTitle(conversation, userId)}
            onTitlePress={onTitlePress}
            headerRight={<GearsIcon onPress={navigateToSettings} />}
        >
            <FlatList
                data={messages}
                ref={scrollViewRef}
                contentContainerStyle={styles.flatListContent}
                ListFooterComponent={FooterComponent}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                onEndReached={fetchMoreMessages}
                onEndReachedThreshold={1}
                inverted
            />
            {typingUserDisplayName && <Text style={styles.typingText}>{typingUserDisplayName}</Text>}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? insets.bottom + 12.5 : 0}
                style={Platform.OS === 'ios' && { marginBottom: insets.bottom }}
            >
                <MessageInput
                    sendMessage={sendMessage}
                    isLoading={isLoadingSendMessage}
                    setIsLoading={setIsLoadingSendMessage}
                    startedTyping={startedTyping}
                    stoppedTyping={stoppedTyping}
                    scrollToBottom={scrollToBottom}
                />
            </KeyboardAvoidingView>
        </HeaderPageLayout>
    );
};

export const ChatRoomSkeleton = () => {
    const renderItem = (number: number) => {
        return number % 2 === 0 ? <MessageItemRightSkeleton key={number} /> : <MessageItemSkeleton key={number} />;
    };

    return (
        <HeaderPageLayout title=''>
            <View style={styles.flatListContent}>{Array.from({ length: 10 }, (_, i) => renderItem(i))}</View>
        </HeaderPageLayout>
    );
};

export default ChatRoom;

const styles = StyleSheet.create({
    flatListContent: {
        gap: 10,
        flexDirection: 'column',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    typingText: {
        width: '100%',
        paddingHorizontal: 10,
        color: Colours.GRAY,
        fontSize: Sizes.FONT_SIZE_SM,
        textAlign: 'left',
        paddingBottom: 5,
    },
});
