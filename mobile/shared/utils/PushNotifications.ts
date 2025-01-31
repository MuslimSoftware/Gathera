import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NOTIFICATIONS_TAB_SCREEN_NAME } from '../hooks/useNavigate';
import { StackActions } from '@react-navigation/native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export const registerForPushNotificationsAsync = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        console.log('Push notifications not granted. Cannot register for push notifications.');
        return;
    }
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID })).data; // Project ID from Expo Dashboard
    console.log('Push token:', token);

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
};

export const navigateToScreenFromPushNotification = (data: any, appNavigationContainerRef: any) => {
    switch (data.type) {
        case 'message':
            appNavigationContainerRef.dispatch(
                StackActions.push('Inbox', {
                    screen: 'ChatRoom',
                    params: { conversationId: data.conversation_id },
                }),
            );
            break;
        case 'invite':
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'Notifications',
            });
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'InviteRequests',
            });
            break;
        case 'followReq':
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'Notifications',
            });
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'FollowRequests',
            });
            break;
        case 'signup':
        case 'follow':
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'Notifications',
            });
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'OtherProfile',
                params: { profileId: data.profileId },
            });
            break;
        case 'gathering-join':
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'Notifications',
            });
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME, {
                screen: 'Gathering',
                params: { gatheringId: data.gatheringId },
            });
            break;
        case 'subscription':
            appNavigationContainerRef.navigate('Subscription');
            break;
        case 'feedback':
            appNavigationContainerRef.navigate('Feedback');
            break;
        default:
            appNavigationContainerRef.navigate(NOTIFICATIONS_TAB_SCREEN_NAME);
    }
};
