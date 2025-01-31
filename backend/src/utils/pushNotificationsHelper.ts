import { sendBatchPushNotifications } from '@config/push.config';
import { compareObjectIds } from '@utils/validators/Validators';

/**
 * Sends a push notification to a list of users. If the user is in the list, they will not be sent a push notification.
 * @param user
 * @param userList
 * @param title header of the push notification
 * @param body body of the push notification
 * @param data
 * @returns void
 */
export const sendUsersPushNotifications = async (user: any, userList: any[], title: string, body?: string, data?: Object) => {
    // send push notifications to all users except sender
    const pushNotificationConfigs = [];
    for (const u of userList) {
        if (compareObjectIds(u._id, user._id)) continue;

        pushNotificationConfigs.push({
            user_id: u._id,
            token: u.expo_push_token,
            title: title,
            body: body,
            data,
        });
    }

    // send push notifications
    await sendBatchPushNotifications(pushNotificationConfigs);
};
