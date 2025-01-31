import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { consoleLogError, consoleLogSuccess, consoleLogWarning } from '@utils/ConsoleLog';
import { UserModel } from '@models/User/user';
import { UserSettingsModel } from '@models/User/userSettings';
import { compareObjectIds } from '@utils/validators/Validators';

export interface PushNotificationConfig {
    user_id: string;
    title: string;
    token?: string;
    body?: string;
    data?: Object;
}

const ExpoClient = new Expo();

/**
 * Sends a batch of push notifications to the Expo push notification service.
 * @param pushNotificationConfigs An array of push notification configurations.
 */
export const sendBatchPushNotifications = async (pushNotificationConfigs: PushNotificationConfig[]) => {
    const messages: ExpoPushMessage[] = [];
    const invalidPushTokens: Set<string> = new Set();

    const usersSettings = await UserSettingsModel.find({ user: { $in: pushNotificationConfigs.map((config) => config.user_id) } })
        .lean()
        .catch((error) => {
            consoleLogError('Error fetching users settings');
            consoleLogError(error);
            return [];
        });

    for (const config of pushNotificationConfigs) {
        if (!config.token) continue; // Skip empty tokens

        if (!Expo.isExpoPushToken(config.token)) {
            consoleLogWarning(
                `Push token "${config.token}" is not a valid Expo push token. Ensure this push token is deleted from the DB. Skipping...`,
            );
            invalidPushTokens.add(config.token);
            continue;
        }

        const userSettings = usersSettings.find((settings: any) => compareObjectIds(settings.user, config.user_id));
        if (!userSettings || !userSettings.is_notifications_enabled) continue; // Skip users who have notifications disabled

        const pushMessage: ExpoPushMessage = {
            to: config.token,
            sound: 'default',
            title: config.title,
            body: config.body,
            data: config.data,
        };

        messages.push(pushMessage);
    }

    const chunks = ExpoClient.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
        try {
            const ticketChunk = await ExpoClient.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            consoleLogError(`Error sending push notification: ${error}`);
        }
    }

    // Delete invalid push tokens from the DB
    if (invalidPushTokens.size > 0) {
        consoleLogWarning(`Deleting ${invalidPushTokens.size} invalid push token(s) from the DB...`);
        await UserModel.updateMany({ expo_push_token: { $in: Array.from(invalidPushTokens) } }, { $set: { expo_push_token: '' } }).catch((error) => {
            consoleLogError('Error deleting invalid push tokens from the DB');
            consoleLogError(error);
        });
    }

    consoleLogSuccess(`Successfully sent ${tickets.length}/${pushNotificationConfigs.length} push notification(s)`);
};

/**
 * Sends a single push notification to the Expo push notification service.
 *
 * **Note:** This is meant for a single push notification. If you have multiple push notifications to send, use **sendBatchPushNotifications** instead.
 * @param pushNotificationConfig The push notification configuration.
 */
export const sendPushNotification = async (pushNotificationConfig: PushNotificationConfig) => {
    await sendBatchPushNotifications([pushNotificationConfig]).catch((error) => {
        consoleLogError('Error sending push notification');
        consoleLogError(error);
    });
};

/**
 * Sends a push notification to all admins.
 * @param title The title of the push notification.
 * @param body The body of the push notification.
 * @param data The data to send with the push notification.
 */
export const sendPushNotificationToAdmins = async (title: string, body: string, data?: Object) => {
    const adminUserPhoneNums: never[] = [];

    const admins = await UserModel.find({ phone_number: { $in: adminUserPhoneNums } })
        .lean()
        .select('_id expo_push_token')
        .catch((err) => {
            consoleLogError('Error fetching admins');
            consoleLogError(err);
            return [];
        });

    const configs = admins.map((admin) => ({
        user_id: admin._id,
        token: admin.expo_push_token,
        title,
        body,
        data,
    }));

    await sendBatchPushNotifications(configs).catch((err) => {
        consoleLogError('Error sending admin push notification');
        consoleLogError(err);
    });
};
