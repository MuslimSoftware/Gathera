import { Request, Response } from 'express';
import { NotificationModel } from '@models/notification';
import StatusError from '@utils/StatusError';
import { compareObjectIds, validateBodyFields } from '@utils/validators/Validators';
import { fetchDocument } from '@utils/fetchDocument';
import { USER_PREVIEW_FIELDS, fetchProfilesWithPrivacy } from '@utils/Profiles';
import { paginatedFetchAsync } from '@utils/Pagination';
import { ConversationModel } from '@models/conversation';
import { MessageModel } from '@models/message';
import { NOTIFICATION_PAGE_SIZE } from '@lib/constants/page-sizes';
import { NotificationType } from '@lib/enums/notification';
import { IGathering } from '@/models/Place/gathering';
import { IPlace } from '@/models/Place/place';
import { IUser, UserModel } from '@/models/User/user';
/**
 * Gets all notifications for the auth'ed user.
 * @route /notification?type=X&page=N
 * @method GET
 * @requireAuth true
 * @return Notification[]
 */
export const getNotifications = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { type } = req.query;

    const getData = async (lowerBound: number, pageSize: number) => {
        return await NotificationModel.find({ user: user._id, type: type ? type : { $exists: true } })
            .skip(lowerBound)
            .limit(pageSize)
            .populate<{ user_from: IUser }>({ path: 'user_from', select: USER_PREVIEW_FIELDS })
            .populate<{ gathering: IGathering }>({ path: 'gathering', select: 'gathering_pic gathering_name user_list max_count' })
            .populate<{ place: IPlace }>({ path: 'place', select: 'name' });
    };

    const { data: notifications, hasMore } = await paginatedFetchAsync(req.query, NOTIFICATION_PAGE_SIZE, getData);

    // Mark all notifications as read
    const promises = [];
    for (const notification of notifications) {
        if (!notification.is_read) {
            notification.is_read = true;
            promises.push(notification.save());
        }
    }

    await Promise.all(promises);

    // Filter out notifications that don't have a user_from because that user was deleted (or something)
    const filteredNotifications = notifications.filter((notif) => notif.user_from !== null);
    const userFroms = filteredNotifications.map((notification) => (notification.user_from ? notification.user_from._id : ''));

    const users = await UserModel.find({ _id: { $in: userFroms } });
    const usersProfiles = await fetchProfilesWithPrivacy(user, users);

    const notificationsWithProfiles = filteredNotifications.map((notification) => {
        const userFrom = usersProfiles.find((user) => compareObjectIds(user._id, notification.user_from._id));
        const isFull = notification.gathering ? notification.gathering.user_list.length === notification.gathering.max_count : false;
        return {
            ...notification.toObject(),
            user_from: {
                ...notification.user_from.toObject(),
                isFollowing: userFrom.isFollowing,
                isRequested: userFrom.isRequested,
            },
            isFull,
        };
    });

    return res.status(200).json({ data: notificationsWithProfiles, hasMore });
};

/**
 * Gets the number of unread follow, followReq, invite, and message notifications for the auth'ed user.
 * @route /notification/unread
 * @method GET
 * @requireAuth true
 * @return The unread count for each type of notification
 */
export const getUnreadNotificationCount = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);

    const promises = [];
    promises.push(
        NotificationModel.countDocuments({
            user: user._id,
            type: 'follow',
            is_read: false,
        }).lean()
    );
    promises.push(NotificationModel.countDocuments({ user: user._id, type: NotificationType.FollowReq }));
    promises.push(NotificationModel.countDocuments({ user: user._id, type: NotificationType.Invite }));

    const userConversations = await ConversationModel.find({
        $and: [{ users: user._id }, { visible_to: user._id }],
    })
        .select('last_message')
        .lean();

    const lastMessageIds = userConversations.map((conversation) => conversation.last_message);
    promises.push(
        MessageModel.countDocuments({
            $and: [{ _id: { $in: lastMessageIds } }, { sender: { $ne: user._id } }, { read_users: { $nin: [user._id] } }],
        })
    );

    const [unreadFollowNotifications, followRequestsCount, gatheringInvitesCount, unreadMessagesCount] = await Promise.all(promises);

    return res.status(200).json({
        unreadFollowNotifications,
        unreadMessagesCount,
        followRequestsCount,
        gatheringInvitesCount,
    });
};

/**
 * Deletes a notification by id.
 * @route /notification/delete/:notification_id
 * @method DELETE
 * @requireAuth true
 * @return The deleted count
 */
export const deleteNotification = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const notification = await fetchDocument(req.params.notification_id, NotificationModel);

    // Make sure the auth'ed user is the owner of the notification
    if (!compareObjectIds(notification.user, user._id)) throw new StatusError("Cannot delete someone else's notification.", 400);

    // Delete the notification
    const deleteCount = await NotificationModel.findByIdAndDelete(notification._id);
    return res.status(200).json(deleteCount);
};
