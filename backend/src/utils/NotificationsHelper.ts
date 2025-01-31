import { ObjectId } from 'mongoose';
import { NotificationModel } from '@models/notification';
import { validateNotificationType } from '@lib/validators/NotificationValidators';
import { USER_PREVIEW_FIELDS } from '@utils/Profiles';
import { IGathering } from '@models/Place/gathering';
import { sendPushNotification } from '@config/push.config';
import { NotificationType } from '@lib/enums/notification';

/**
 * Gets the invited user list for a gathering.
 * @param gatheringId The id of the gathering to get the invited user list for.
 * @returns The list of users invited to the gathering populated with user preview fields.
 */
export const getGatheringInvitedUserList = async (gatheringId: string) => {
    const invitees = await NotificationModel.find({ gathering: gatheringId, type: NotificationType.Invite })
        .select('user')
        .populate({ path: 'user', select: USER_PREVIEW_FIELDS })
        .lean();
    return invitees.map((invitee: any) => invitee.user);
};

/**
 * Attaches the invited user list to a single gathering.
 * @param gathering The gathering document or object to get the invited user list for.
 * @returns The gathering with the invited user list attached.
 */
export const attachInvitedUserListToGathering = async (gathering: IGathering) => {
    const invitees = await getGatheringInvitedUserList(gathering._id);
    const gatheringObj = gathering.toObject ? gathering.toObject() : gathering;
    return {
        ...gatheringObj,
        invited_user_list: invitees,
    };
};

/**
 * Attaches the invited user lists for a list of gatherings.
 * @param gatherings The gathering documents or objects to get the invited user lists for.
 * @returns The gatherings with the invited user lists attached.
 */
export const attachInvitedUserListToGatherings = async (gatherings: IGathering[]) => {
    const invitees = await NotificationModel.find({ gathering: { $in: gatherings.map((gathering) => gathering._id) }, type: NotificationType.Invite })
        .select('gathering user')
        .populate({ path: 'user', select: USER_PREVIEW_FIELDS })
        .lean();

    const gatheringsInviteesMap = invitees.reduce((acc: { [gathering: string]: any }, invitee: any) => {
        if (!acc[invitee.gathering]) acc[invitee.gathering] = [];
        acc[invitee.gathering].push(invitee.user);
        return acc;
    }, {});

    return gatherings.map((gathering: IGathering) => {
        const gatheringObj = gathering.toObject ? gathering.toObject() : gathering;
        return {
            ...gatheringObj,
            invited_user_list: gatheringsInviteesMap[gathering._id] || [],
        };
    });
};

/**
 * Generic function to create a notification.
 * @param userFrom The user document who created the notification.
 * @param userTo The user document who will receive the notification.
 * @param content The message of the notification as viewed from the receiving user.
 * @param type The type of notification.
 */
const createNotification = async (userFrom: any, userTo: any, type: NotificationType, details: Object = {}) => {
    if (!validateNotificationType(type)) throw new Error('Invalid notification type.');

    await NotificationModel.create({
        user_from: userFrom._id,
        user: userTo._id,
        type,
        ...details,
    });
};

/**
 * Generic function to delete a notification.
 * @param userFrom The user document who created the notification.
 * @param userTo The user document who will receive the notification.
 * @param type The type of notification.
 *
 */
const deleteNotification = async (userFrom: any, userTo: any, type: NotificationType) => {
    if (!validateNotificationType(type)) throw new Error('Invalid notification type.');

    await NotificationModel.deleteOne({
        user_from: userFrom._id,
        user: userTo._id,
        type,
    });
};

export const createFollowNotification = async (userFrom: any, userTo: any) => {
    await createNotification(userFrom, userTo, NotificationType.Follow);

    // Send push notification to userTo
    const notification = {
        user_id: userTo._id,
        token: userTo.expo_push_token,
        title: `${userFrom.display_name} followed you!`,
        data: { type: 'follow', picture_uri: userFrom.avatar_uri, profileId: userFrom._id },
    };
    await sendPushNotification(notification);
};

export const createFollowRequestNotification = async (userFrom: any, userTo: any) => {
    await createNotification(userFrom, userTo, NotificationType.FollowReq);

    // Send push notification to userTo
    const notification = {
        user_id: userTo._id,
        token: userTo.expo_push_token,
        title: `${userFrom.display_name} requested to followed you.`,
        data: { type: 'followReq', picture_uri: userFrom.avatar_uri },
    };
    await sendPushNotification(notification);
};

export const createInviteNotification = async (userFrom: any, userTo: any, gatheringId: string | ObjectId, placeId: string | ObjectId) => {
    await createNotification(userFrom, userTo, NotificationType.Invite, { gathering: gatheringId, place: placeId });

    // Send push notification to userTo
    const notification = {
        user_id: userTo._id,
        token: userTo.expo_push_token,
        title: `${userFrom.display_name} invited you to their gathering!`,
        data: { type: 'invite', picture_uri: userFrom.avatar_uri },
    };
    await sendPushNotification(notification);
};

export const deleteFollowNotification = async (userFrom: any, userTo: any) => {
    await deleteNotification(userFrom, userTo, NotificationType.Follow);
};

export const deleteFollowRequestNotification = async (userFrom: any, userTo: any) => {
    await deleteNotification(userFrom, userTo, NotificationType.FollowReq);
};

export const deleteInviteNotification = async (userFrom: any, userTo: any) => {
    await deleteNotification(userFrom, userTo, NotificationType.Invite);
};
