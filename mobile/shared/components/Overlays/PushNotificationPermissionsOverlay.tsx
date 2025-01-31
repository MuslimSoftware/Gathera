import React from 'react';
import * as Notifications from 'expo-notifications';
import { Overlay } from './Overlay';
import { useAsyncStorage } from '../../hooks/useAsyncStorage';

export const PUSH_NOTIFICATION_PERMISSIONS_KEY = 'HasRespondedToPushNotificationPermissions';

interface Props {
    visible: boolean;
    dismiss: () => void;
}

export const PushNotificationPermissionsOverlay = ({ visible, dismiss }: Props) => {
    const { storeItemAsync } = useAsyncStorage<boolean>(PUSH_NOTIFICATION_PERMISSIONS_KEY, false);

    const requestPushNotificationPermission = async () => {
        await Notifications.requestPermissionsAsync().catch(() => ({ status: 'denied' }));
        storeItemAsync(true); // Store that the user has responded to the overlay so that it doesn't show again
        dismiss(); // Dismiss the overlay regardless of the user's response (allow them to skip the overlay)
    };

    return (
        <Overlay
            content={{
                title: 'Allow push notifications',
                description: "You'll be notified when other users invite and message you.",
                imageSource: require('../../../assets/images/services/notifications.jpg'),
            }}
            dismissOverlay={requestPushNotificationPermission}
            modalProps={{ visible }}
            dismissButtonLabel='Continue'
            dismissOnBackdropPress
        />
    );
};
