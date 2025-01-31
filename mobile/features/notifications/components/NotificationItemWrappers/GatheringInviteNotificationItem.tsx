import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { NotificationItem } from '../NotificationItem';
import { InviteNotificationAction } from '../InviteNotificationAction';
import { useNavigate } from '../../../../shared/hooks/useNavigate';
import { Colours, Sizes } from '../../../../shared/styles/Styles';
import { getNotificationContextValues } from '../../context/NotificationContext';

interface GatheringInviteNotificationItemProps {
    notification: any;
    setNotifications: any;
}

export const GatheringInviteNotificationItem = ({ notification, setNotifications }: GatheringInviteNotificationItemProps) => {
    const { navigateToScreen } = useNavigate();
    const { setGatheringInvitesCount } = getNotificationContextValues();

    const onActionPress = () => {
        setNotifications((prevNotifications: any[]) => prevNotifications.filter((prevNotification) => prevNotification._id !== notification._id));
        setGatheringInvitesCount((prev: number) => prev - 1);
    };

    const onNotificationPress = () => {
        navigateToScreen('Gathering', { gatheringId: notification.gathering._id });
    };

    if (!notification.gathering) return <></>;

    return (
        <NotificationItem
            notification={notification}
            onTextPress={onNotificationPress}
            imageUrl={notification.gathering.gathering_pic}
            onImagePress={onNotificationPress}
            textComponent={
                <Text style={styles.placeName} numberOfLines={1}>
                    {notification.place.name}
                </Text>
            }
        >
            <InviteNotificationAction notification={notification} onPress={onActionPress} />
        </NotificationItem>
    );
};

const styles = StyleSheet.create({
    placeName: {
        maxWidth: '80%',
        fontWeight: '500',
        color: Colours.PRIMARY,
    },
    gatheringName: {
        maxWidth: '90%',
        fontSize: Sizes.FONT_SIZE_SM,
        fontWeight: '500',
        color: Colours.GRAY,
    },
});
