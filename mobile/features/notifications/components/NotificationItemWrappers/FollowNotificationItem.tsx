import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { FollowUserListItem, FollowUserListItemSkeleton } from '../../../../shared/components/ListItems/FollowUserListItem';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { getTimeUntilEvent } from '../../../../shared/utils/TimeUntilEvent';
import { ProfilePictureSize } from '../../../../types/User';

interface FollowNotificationItemProps {
    notification: any;
}

const PICTURE_SIZE: ProfilePictureSize = 'xsmall';

const FollowNotificationItem = ({ notification }: FollowNotificationItemProps) => {
    const time = getTimeUntilEvent(notification.createdAt).short;

    return (
        <View style={styles.wrapper}>
            <FollowUserListItem
                profile={notification.user_from}
                textComponent={
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.nameText} numberOfLines={1}>
                            {notification.user_from.display_name}{' '}
                        </Text>
                        <Text style={styles.messageText} numberOfLines={2}>
                            followed you <Text style={styles.timeText}>{time}</Text>
                        </Text>
                    </View>
                }
                profilePicSize={PICTURE_SIZE}
            />
        </View>
    );
};

export const FollowNotificationItemSkeleton = () => {
    return (
        <View style={styles.wrapper}>
            <FollowUserListItemSkeleton profilePicSize={PICTURE_SIZE} />
        </View>
    );
};

export default FollowNotificationItem;

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        gap: 10,
    },
    messageText: {
        fontSize: Sizes.FONT_SIZE_SM,
        flexDirection: 'row',
        flexWrap: 'wrap',
        color: Colours.DARK,
    },
    nameText: {
        fontWeight: 'bold',
    },
    timeText: {
        color: Colours.GRAY,
    },
});
