import { UserBorder } from '@/gathera-lib/enums/user';
import { validateObjectId } from './../utils/validators/Validators';
import { UserModel } from '@/models/User/user';
import { validateBodyFields } from '@/utils/validators/Validators';
import { Request, Response } from 'express';
import { sendPushNotificationToAdmins } from '@/config/push.config';

/**
 * Handle RevenueCat webhook event for user subscription.
 * @route /webhook/revenue-cat/subscribed
 * @method POST
 * @requireRevenueCatAuth true
 * @return 200 OK if user subscription status was updated successfully, 500 Internal Server Error if an error occurred
 */
export const userSubscribed = async (req: Request, res: Response) => {
    const { user_id } = validateBodyFields(req.body, [{ field: 'user_id', validator: validateObjectId, required: true }]);

    const NUM_RETRIES = 3;
    let retries = 0;
    let error;

    while (retries < NUM_RETRIES) {
        try {
            const update = await UserModel.updateOne({ _id: user_id }, { subscription: 'premium' });

            if (update.modifiedCount === 1) {
                // Send push notification to admins
                sendPushNotificationToAdmins('Subscription', `User ${user_id} has subscribed.`);
                return res.status(200).json({ message: 'User subscription updated' });
            } else {
                throw new Error('User subscription status was not updated');
            }
        } catch (err) {
            retries++;
            error = err;
        }
    }

    // If we reach this point, we've exceeded the number of retries and the user's subscription status was not updated
    console.log(`Error subscribing user [${user_id}] to premium: `, error);

    // Alert admins
    sendPushNotificationToAdmins('Subscription Error', `Error subscribing user ${user_id} to premium.`);

    return res.status(500).json({ message: 'Error updating user subscription' });
};

/**
 * Handle RevenueCat webhook event for expiring user subscription.
 * @route /webhook/revenue-cat/expired
 * @method POST
 * @requireRevenueCatAuth true
 * @return 200 OK if user subscription status was updated successfully, 500 Internal Server Error if an error occurred
 */
export const userSubscriptionExpired = async (req: Request, res: Response) => {
    const { user_id } = validateBodyFields(req.body, [{ field: 'user_id', validator: validateObjectId, required: true }]);

    const NUM_RETRIES = 3;
    let retries = 0;
    let error;

    while (retries < NUM_RETRIES) {
        try {
            const update = await UserModel.updateOne({ _id: user_id }, { subscription: 'free', border: UserBorder.NONE });

            if (update.modifiedCount === 1) {
                // Send push notification to admins
                sendPushNotificationToAdmins('Subscription', `User ${user_id} subscription has expired.`);

                return res.status(200).json({ message: 'User subscription updated' });
            } else {
                throw new Error('User subscription status was not updated');
            }
        } catch (err) {
            retries++;
            error = err;
        }
    }

    // If we reach this point, we've exceeded the number of retries and the user's subscription status was not updated
    console.log(`Error expiring subscription for user [${user_id}]: `, error);

    // Alert admins
    sendPushNotificationToAdmins('Subscription Error', `Error expiring subscription for user ${user_id}.`);

    return res.status(500).json({ message: 'Error updating user subscription' });
};
