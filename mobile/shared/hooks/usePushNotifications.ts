import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { navigateToScreenFromPushNotification, registerForPushNotificationsAsync } from '../utils/PushNotifications';
import { PushNotification } from '../../types/Notification';
import { getPlaceBottomSheetContextValues } from '../context/PlaceBottomSheetContext';
import { getNotificationContextValues } from '../../features/notifications/context/NotificationContext';
import { getAuthContextValues } from '../context/AuthContext';
import { getResponse, normalizeRequestConfig } from '../utils/fetchHookUtils';

export const usePushNotifications = () => {
    const {
        user: { expo_push_token: prevPushToken },
        accessToken,
    } = getAuthContextValues();
    const { appNavigationContainerRef } = getPlaceBottomSheetContextValues();
    const { setUnreadMessagesCount, setUnreadFollowsCount, setFollowRequestsCount, setGatheringInvitesCount } = getNotificationContextValues();
    const [pushToken, setPushToken] = useState<any>('');
    const [notification, setNotification] = useState<PushNotification>();

    const updateNotificationCounts = (type: string) => {
        switch (type) {
            case 'message':
                setUnreadMessagesCount((count: number) => count + 1);
                break;
            case 'follow':
                setUnreadFollowsCount((count: number) => count + 1);
                break;
            case 'followReq':
                setFollowRequestsCount((count: number) => count + 1);
                break;
            case 'invite':
                setGatheringInvitesCount((count: number) => count + 1);
                break;
            default:
                return;
        }
    };

    useEffect(() => {
        // Register for push notifications and set the expoPushToken
        registerForPushNotificationsAsync()
            .then((token) => setPushToken(token))
            .catch((error) => console.log('Error getting push token', error));

        // Set a listener for when a notification is received while the app is foregrounded
        const notifReceivedListener = Notifications.addNotificationReceivedListener((notification) => {
            const title = notification.request.content.title!;
            const subtitle = notification.request.content.subtitle ? notification.request.content.subtitle : undefined;
            const body = notification.request.content.body!;
            const data: any = notification.request.content.data;

            updateNotificationCounts(data.type);

            const screenName = appNavigationContainerRef.getCurrentRoute().name;
            const conversationId = appNavigationContainerRef.getCurrentRoute().params?.conversationId;
            if (screenName === 'ChatRoom' && conversationId === data.conversation_id) {
                console.log(`Notification blocked - ${title}: ${body}`);
                return;
            }

            console.log(`Notification received - ${title}: ${body}`);
            setNotification({ title, subtitle, body, data });
        });

        // Set a listener for when the user interacts with a notification (eg. taps on it)
        const notifResponseReceivedListener = Notifications.addNotificationResponseReceivedListener((response) => {
            const data = response.notification.request.content.data;
            navigateToScreenFromPushNotification(data, appNavigationContainerRef);
        });

        return () => {
            Notifications.removeNotificationSubscription(notifReceivedListener);
            Notifications.removeNotificationSubscription(notifResponseReceivedListener);
        };
    }, []);

    useEffect(() => {
        const uploadPushToken = async () => {
            await getResponse(normalizeRequestConfig({ url: '/user/push-token', method: 'POST', body: { pushToken } }, true, accessToken));
        };

        // If accessToken exists & is different from current token, send the pushToken to the backend server to store it
        if (accessToken && pushToken && pushToken !== prevPushToken) uploadPushToken();
    }, [pushToken, accessToken]);

    const clearPreviousNotification = () => {
        setNotification(undefined);
    };

    return { pushToken, notification, clearPreviousNotification };
};
