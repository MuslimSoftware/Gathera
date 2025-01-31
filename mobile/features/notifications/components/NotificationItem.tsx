import { StyleSheet, Text, View, Pressable } from 'react-native';
import React from 'react';
import { ProfilePicture } from '../../../shared/components/MainPictures/ProfilePicture';
import { Colours, Sizes } from '../../../shared/styles/Styles';
import { getTimeUntilEvent } from '../../../shared/utils/TimeUntilEvent';
import { ProfilePictureSize } from '../../../types/User';

const PICTURE_SIZE: ProfilePictureSize = 'xxsmall';

interface NotificationItemProps {
    notification: any;

    imageUrl?: string;
    onImagePress?: () => void;
    onTextPress?: () => void;
    textComponent?: React.ReactNode;
    children?: React.ReactNode;
}

export const NotificationItem = ({ notification, imageUrl, onImagePress, onTextPress, textComponent, children }: NotificationItemProps) => {
    const time = getTimeUntilEvent(notification.createdAt).short;

    return (
        <View style={styles.wrapper}>
            <ProfilePicture
                uri={imageUrl ?? notification.user_from.avatar_uri}
                size={PICTURE_SIZE}
                onPress={onImagePress}
                border={notification.user_from.border}
            />
            <Pressable style={styles.textWrapper} onPress={onTextPress}>
                <Text style={styles.userFromText} numberOfLines={1}>
                    {notification.user_from.display_name + ' '}
                </Text>
                <View style={styles.placeNameTimeWrapper}>
                    {textComponent && textComponent}
                    <Text style={styles.timeText}>{time}</Text>
                </View>
            </Pressable>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        gap: 10,
    },
    messageText: {
        color: Colours.DARK,
    },
    timeText: {
        color: Colours.GRAY,
    },
    buttonWrapper: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    button: {
        borderRadius: Sizes.BORDER_RADIUS_MD,
        paddingVertical: 0,
    },
    placeNameTimeWrapper: {
        width: '95%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    userFromText: {
        fontWeight: 'bold',
        maxWidth: '90%',
    },
    textWrapper: {
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
});
