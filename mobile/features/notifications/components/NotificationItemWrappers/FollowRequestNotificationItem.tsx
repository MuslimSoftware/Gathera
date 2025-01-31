import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { getTimeUntilEvent } from '../../../../shared/utils/TimeUntilEvent';
import { FollowRequestNotificationAction } from '../FollowRequestNotificationAction';
import { Colours } from '../../../../shared/styles/Styles';
import { UserListItem } from '../../../../shared/components/ListItems/UserListItem';
import { getNotificationContextValues } from '../../context/NotificationContext';
import { ellipsizeText } from '../../../../shared/utils/uiHelper';

export const FollowRequestNotificationItem = ({ notification, onNotificationPress }: any) => {
    const time = getTimeUntilEvent(notification.createdAt).short;
    const { setFollowRequestsCount } = getNotificationContextValues();

    const handleNotificationPress = () => {
        onNotificationPress();
        setFollowRequestsCount((prev: number) => prev - 1);
    };

    return (
        <UserListItem
            profile={notification.user_from}
            textComponent={
                <Text style={styles.messageText}>
                    <Text style={styles.nameText}>{ellipsizeText(notification.user_from.display_name, 15)}</Text> has requested to follow you{' '}
                    <Text style={styles.timeText}>{time}</Text>
                </Text>
            }
        >
            <FollowRequestNotificationAction notificationId={notification._id} onPress={handleNotificationPress} />
        </UserListItem>
    );
};

const styles = StyleSheet.create({
    messageText: {
        maxWidth: '75%',
    },
    nameText: {
        fontWeight: 'bold',
    },
    timeText: {
        color: Colours.GRAY,
    },
});
