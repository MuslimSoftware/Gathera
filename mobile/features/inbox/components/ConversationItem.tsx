import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Conversation } from '../../../types/Inbox';
import { getConversationTitle } from '../../../shared/utils/Conversation';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { PROFILE_PIC_SIZES, ProfilePicture } from '../../../shared/components/MainPictures/ProfilePicture';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { getTimeSince } from '../utils/TimeHelper';
import { GroupIcon } from '../../../shared/components/Core/Icons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GroupProfilePicture from '../../../shared/components/GroupProfilePicture';
import { useHideConversation } from '../hooks/useHideConversation';
import { LoadingSkeleton } from '../../../shared/components/Core/LoadingSkeleton';
import { getNotificationContextValues } from '../../notifications/context/NotificationContext';
import { ellipsizeText } from '../../../shared/utils/uiHelper';

interface ConversationItemProps {
    conversation: Conversation;
    removeConversation?: () => void;
}

const ConversationItem = ({ conversation, removeConversation }: ConversationItemProps) => {
    const [isSwiping, setIsSwiping] = React.useState(false);
    const { hideConversation } = useHideConversation(conversation._id);
    const { setUnreadMessagesCount } = getNotificationContextValues();
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const navigation: any = useNavigation();

    const title = getConversationTitle(conversation, userId);

    const otherUser = conversation.users.find((user) => user._id !== userId);

    const conversationPressHandler = () => {
        if (!isSwiping) {
            if (conversation.last_message && !conversation.last_message.read_users.includes(userId)) {
                setUnreadMessagesCount((prev: number) => prev - 1);
            }
            navigation.navigate('ChatRoom', { conversationId: conversation._id, title });
        }
    };

    const removeConversationHandler = () => {
        hideConversation();
        removeConversation && removeConversation();
    };

    const isGatheringChat = conversation.gathering ? true : false;
    const isGroupChat = !isGatheringChat && conversation.users.length > 2;
    const uri = isGatheringChat ? conversation.gathering?.gathering_pic : otherUser?.avatar_uri;
    const otherUri = conversation.users.find((user) => user._id !== otherUser?._id)?.avatar_uri;

    return (
        <Swipeable
            overshootRight={false}
            onSwipeableWillOpen={() => setIsSwiping(true)}
            onSwipeableWillClose={() => setIsSwiping(false)}
            renderRightActions={(progress) => {
                const trans = progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [85, 0],
                });
                return (
                    <Animated.View style={[styles.delBtnWrapper, { transform: [{ translateX: trans }] }]}>
                        <Pressable
                            style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                            onPress={removeConversationHandler}
                        >
                            <Text style={{ color: Colours.WHITE }}>Delete</Text>
                        </Pressable>
                    </Animated.View>
                );
            }}
            friction={2}
        >
            <TouchableWithoutFeedback style={styles.wrapper} onPress={conversationPressHandler}>
                <View style={styles.imageWrapper}>
                    {isGroupChat && <GroupProfilePicture uri={uri} otherUri={otherUri} />}
                    {!isGroupChat && (
                        <ProfilePicture
                            uri={uri}
                            size='medium'
                            profileId={!isGatheringChat ? otherUser?._id : undefined}
                            icon={isGatheringChat && <GroupIcon size={Sizes.ICON_SIZE_SM} />}
                        />
                    )}
                </View>
                <View style={styles.rowWrapper}>
                    <View style={styles.firstRow}>
                        <Text style={styles.convoTitle} numberOfLines={1}>
                            {title}
                        </Text>
                        <Text style={styles.updatedAtText}>{getTimeSince(new Date(conversation.updatedAt))}</Text>
                    </View>
                    {isGatheringChat && (
                        <View style={styles.secondRow}>
                            <Text style={styles.placeName} numberOfLines={1}>
                                {conversation.gathering?.place.name}
                            </Text>
                            {!conversation.last_message && (
                                <View style={styles.newTag}>
                                    <Text style={styles.notificationText}>New</Text>
                                </View>
                            )}
                        </View>
                    )}
                    <View style={styles.secondRow}>
                        <View style={styles.lastMessageWrapper}>
                            <Text style={styles.convoLastMessage} numberOfLines={1}>
                                {!conversation.last_message && isGatheringChat && 'Say hi to the group! 👋'}
                                {!conversation.last_message && !isGatheringChat && `Say hi to ${ellipsizeText(otherUser?.display_name ?? '', 15)}!`}
                                {isGatheringChat &&
                                    conversation.last_message &&
                                    ellipsizeText(conversation.last_message.sender.display_name, 15) + ': '}
                                {conversation.last_message && conversation.last_message.message}
                            </Text>
                        </View>

                        {!conversation.last_message && !isGatheringChat && (
                            <View style={styles.newTag}>
                                <Text style={styles.notificationText}>New</Text>
                            </View>
                        )}
                        {conversation.last_message && !conversation.last_message.read_users.includes(userId) && <View style={styles.notification} />}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
};

export const ConversationItemSkeleton = () => {
    return (
        <View style={styles.skeletonWrapper}>
            <LoadingSkeleton
                style={{
                    width: PROFILE_PIC_SIZES['medium'].width,
                    height: PROFILE_PIC_SIZES['medium'].height,
                    borderRadius: Sizes.BORDER_RADIUS_FULL,
                }}
            />
            <View style={styles.skeletonTextCol}>
                <LoadingSkeleton style={{ width: '50%', height: 15 }} />
                <LoadingSkeleton style={{ width: '70%', height: 15 }} />
            </View>
        </View>
    );
};

export default ConversationItem;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    convoTitle: {
        maxWidth: '85%',
        fontSize: Sizes.FONT_SIZE_MD,
        fontWeight: '500',
    },
    placeName: {
        maxWidth: '85%',
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.PRIMARY,
        fontWeight: '400',
    },
    updatedAtText: {
        fontSize: Sizes.FONT_SIZE_SM,
        color: Colours.GRAY,
    },
    notification: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 12.5,
        height: 12.5,
        borderRadius: Sizes.BORDER_RADIUS_LG,
        backgroundColor: Colours.RED,
    },
    notificationText: {
        fontSize: Sizes.FONT_SIZE_XS,
        color: Colours.WHITE,
        fontWeight: '600',
    },
    imageWrapper: {
        width: PROFILE_PIC_SIZES['medium'].width,
        height: PROFILE_PIC_SIZES['medium'].height + 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    convoLastMessage: {
        fontSize: Sizes.FONT_SIZE_MD,
        color: Colours.GRAY,
    },
    lastMessageWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        maxWidth: '75%',
    },
    firstRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    secondRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    rowWrapper: {
        flex: 1,
        marginLeft: 10,
        gap: 0,
    },
    newTag: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: Sizes.BORDER_RADIUS_FULL,
        backgroundColor: Colours.GREEN,
    },
    delBtnWrapper: {
        marginLeft: 10,
        width: 75,
        height: '100%',
        backgroundColor: Colours.RED,
    },
    skeletonWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    skeletonTextCol: {
        flex: 1,
        marginLeft: 10,
        gap: 5,
    },
});
