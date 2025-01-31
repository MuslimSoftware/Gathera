import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { getAuthContextValues } from '../../../shared/context/AuthContext';
import { Sizes, Colours } from '../../../shared/styles/Styles';
import { Message } from '../../../types/Inbox';
import { PROFILE_PIC_SIZES, ProfilePicture } from '../../../shared/components/MainPictures/ProfilePicture';
import { UserPreview } from '../../../types/User';
import { SubscriptionType, UserBorder } from '../../../gathera-lib/enums/user';
import { LoadingSkeleton } from '../../../shared/components/Core/LoadingSkeleton';

const MessageItem = React.memo(({ message, users }: { message: Message; users: UserPreview[] }) => {
    const {
        user: { _id: userId },
    } = getAuthContextValues();
    const isSender = message.sender === userId || message.sender._id === userId;
    let senderProfile: any = users.find((u) => u._id === message.sender._id)!;

    if (!senderProfile) {
        senderProfile = {
            _id: '',
            avatar_uri: '',
            border: UserBorder.NONE,
            subscription: SubscriptionType.FREE,
        };
    }

    return (
        <View style={[styles.messageWrapper, isSender ? styles.senderAlignment : styles.receiverAlignment]}>
            {!isSender && (
                <ProfilePicture uri={senderProfile.avatar_uri} profileId={message.sender._id} size='xxsmall' border={senderProfile.border} />
            )}
            <View style={[styles.textWrapper, isSender ? styles.senderBackground : styles.receiverBackground]}>
                <Text style={styles.messageText}>{message.message}</Text>
            </View>
        </View>
    );
});

export const MessageItemSkeleton = () => {
    const steps = [30, 45, 60];
    const height = steps[Math.floor(Math.random() * 3)];
    return (
        <View style={styles.messageWrapper}>
            <LoadingSkeleton style={{ ...PROFILE_PIC_SIZES['xsmall'], borderRadius: Sizes.BORDER_RADIUS_FULL }} />
            <LoadingSkeleton style={{ width: '50%', height }} />
        </View>
    );
};

export const MessageItemRightSkeleton = () => {
    const steps = [30, 45, 60];
    const height = steps[Math.floor(Math.random() * 3)];
    return (
        <View style={[styles.messageWrapper, styles.senderAlignment]}>
            <LoadingSkeleton style={{ width: '50%', height }} />
        </View>
    );
};

export default MessageItem;

const styles = StyleSheet.create({
    messageWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 10,
    },
    senderAlignment: {
        alignSelf: 'flex-end',
    },
    receiverAlignment: {
        alignSelf: 'flex-start',
    },
    textWrapper: {
        borderRadius: Sizes.BORDER_RADIUS_LG,
        paddingVertical: 7.5,
        paddingHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '50%',
    },
    messageText: {
        fontSize: Sizes.FONT_SIZE_LG,
    },
    senderBackground: {
        backgroundColor: Colours.PRIMARY_TRANSPARENT_50,
    },
    receiverBackground: {
        backgroundColor: Colours.GRAY_LIGHT,
    },
});
