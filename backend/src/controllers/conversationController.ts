import { validateConversationName } from './../gathera-lib/validators/ConversationValidators';
import { validateArray } from '@lib/validators/Validators';
import { Request, Response } from 'express';
import { IUser, UserModel } from '@models/User/user';
import StatusError from '@utils/StatusError';
import { ConversationModel } from '@models/conversation';
import { MessageModel } from '@models/message';
import { compareObjectIds, validateBodyFields } from '@utils/validators/Validators';
import { fetchDocument } from '@utils/fetchDocument';
import { USER_PREVIEW_FIELDS, determinePermissions, getIsFollowing } from '@utils/Profiles';
import { getFullConversationInfo } from '@utils/ConversationsHelper';
import { paginatedFetchAsync } from '@utils/Pagination';
import { NotificationModel } from '@models/notification';
import { sendUsersPushNotifications } from '@utils/pushNotificationsHelper';
import { validateMessage } from '@lib/validators/MessageValidators';
import { CONVERSATION_PAGE_SIZE, MESSAGE_PAGE_SIZE } from '@lib/constants/page-sizes';
import { NotificationType } from '@lib/enums/notification';
import { IFollower, FollowerModel } from '@/models/User/follower';

/**
 * Gets all conversations for the auth'ed user.
 * @route /conversation?page=N
 * @method GET
 * @requireAuth true
 * @return conversation[]
 */
export const getAllConversationsForUser = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);

    const getData = async (lowerBound: number, pageSize: number) => {
        const conversations = await ConversationModel.find({ $and: [{ users: { $in: [user._id] } }, { visible_to: { $in: [user._id] } }] })
            .sort({ updatedAt: 'descending' })
            .skip(lowerBound)
            .limit(pageSize)
            .populate('users', USER_PREVIEW_FIELDS)
            .populate({
                path: 'gathering',
                select: 'gathering_pic createdAt place',
                populate: {
                    path: 'place',
                    select: 'name',
                },
            })
            .populate({
                path: 'last_message',
                select: 'message createdAt sender read_users',
                populate: {
                    path: 'sender',
                    select: USER_PREVIEW_FIELDS,
                },
            })
            .lean();

        return conversations;
    };

    const response = await paginatedFetchAsync(req.query, CONVERSATION_PAGE_SIZE, getData);
    return res.status(200).json(response);
};

/**
 * Creates a new conversation with specified users.
 * @route /conversation/create
 * @method POST
 * @requireAuth true
 * @return the created conversation, or the existing conversation if it already exists.
 */
export const createConversation = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    let { users } = validateBodyFields(req.body, [
        // Required fields
        { field: 'users', validator: validateArray },
    ]);

    // remove duplicates
    users.push(user._id.toString());
    users = [...new Set(users)];

    if (users.length < 2) throw new StatusError('Cannot start a conversation with yourself.', 400);

    const usersToInvite: any = await UserModel.find({ _id: { $in: users } })
        .populate('blocked_users')
        .lean();
    if (usersToInvite.length !== users.length) throw new StatusError('At least one of the users do not exist.', 400);

    // Add isFollowing to usersToInvite using getIsFollowing and Promise.all
    const getIsFollowingPromises = usersToInvite.map((u: any) => getIsFollowing(user._id, u._id));
    const isFollowingArray = await Promise.all(getIsFollowingPromises);
    usersToInvite.map((u: any, i: number) => {
        u.is_following = isFollowingArray[i];
        return u;
    });

    // check if any of the users have blocked the authed user
    for (const userToInvite of usersToInvite) {
        if (userToInvite.blocked_users.some((block: any) => compareObjectIds(block.user_blocked, user._id))) {
            throw new StatusError('Cannot start a conversation with a user who has blocked you.', 400);
        }

        const isVisible = determinePermissions(user._id, userToInvite._id, userToInvite.is_public, userToInvite.is_following, false);
        if (!isVisible) throw new StatusError('Cannot start a conversation with a user who is private.', 400);
    }

    // check if conversation already exists
    const conversation = await ConversationModel.findOne({
        users: { $all: users, $size: users.length },
        gathering: { $exists: false },
    });
    let convoId: string = '';
    if (conversation) convoId = conversation._id.toString();

    // if not existing, create conversation with users (they are all valid)
    if (!conversation) {
        // If a 1 on 1 chat is created don't show the other user the conversation in their inbox
        // If a group chat is created show all users the conversation in their inbox
        let visible_to = users;
        if (users.length <= 2) {
            visible_to = users.filter((u: any) => compareObjectIds(u, user._id));
        }

        const newConversation = await ConversationModel.create({
            conversation_name: '',
            users,
            visible_to,
        });
        convoId = newConversation._id.toString();

        // If group chat created, notify all users
        if (usersToInvite.length > 2) {
            sendUsersPushNotifications(user, usersToInvite, user.display_name, `Added you to a conversation`, {
                type: 'message',
                conversation_id: newConversation._id,
                picture_uri: user.avatar_uri,
            });
        }
    }

    // redirect to getConversationById
    req.params.conversation_id = convoId;
    return getConversationById(req, res);
};

/**
 * Gets a conversation by conversation_id if the auth'ed user is in it.
 * @route /conversation/get/:conversation_id
 * @method GET
 * @requireAuth true
 * @return conversation
 */
export const getConversationById = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const conversation = await getFullConversationInfo(req.params.conversation_id, user._id.toString());
    const usersInConversation = conversation.users.map((u: any) => u._id.toString());

    const followedUsers: IFollower[] = await FollowerModel.find({
        user: { $in: usersInConversation },
        follower: user._id,
    }).lean();
    const followRequests = await NotificationModel.find({
        user_from: user._id,
        user: { $in: usersInConversation },
        type: NotificationType.FollowReq,
    }).lean();

    conversation.users.map((u: any) => {
        if (u._id.toString() === user._id.toString()) return u;

        u.isFollowing = followedUsers.some((follow: any) => compareObjectIds(follow.user, u._id));
        u.isRequested = followRequests.some((followReq: any) => compareObjectIds(followReq.user, u._id));

        return u;
    });

    return res.status(200).json(conversation);
};

/**
 * Update conversation title.
 * @route /conversation/update/:conversation_id
 * @method PATCH
 * @requireAuth true
 * @returns updated conversation document
 */
export const updateConversation = async (req: Request, res: Response) => {
    const { user, conversation_name }: { user: IUser; conversation_name: string } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'conversation_name', validator: validateConversationName },
    ]);
    const { conversation_id } = req.params;

    const conversation = await ConversationModel.findOne({ _id: conversation_id, users: user._id }).populate('users', USER_PREVIEW_FIELDS);
    if (!conversation) throw new StatusError('Conversation does not exist.', 400);

    conversation.conversation_name = conversation_name;
    await conversation.save();
    return res.status(200).json(conversation.toObject());
};

/**
 * Adds the specified user to the conversation. Auth'ed user must be in the conversation.
 * @route /conversation/add-user/:conversation_id/
 * @method POST
 * @requireAuth true
 * @return Updated conversation
 */
export const addUsersToConversation = async (req: Request, res: Response) => {
    const { user: authed_user, users_to_add } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'users_to_add', validator: validateArray },
    ]);

    const conversation = await fetchDocument(req.params.conversation_id, ConversationModel);

    // check if auth'ed user is in conversation
    if (!conversation.users.some((id: any) => compareObjectIds(authed_user._id, id)))
        throw new StatusError('Authed user is not in conversation.', 400);

    // check if invited users exist
    const usersToAddDocuments = await UserModel.find({ _id: { $in: users_to_add } })
        .select('_id')
        .lean();
    if (usersToAddDocuments.length !== users_to_add.length) throw new StatusError('At least one of the users do not exist.', 400);

    // Throw error if any of the users are already in the conversation
    const usersToAdd = usersToAddDocuments.map((u: any) => u._id.toString());
    if (usersToAdd.some((u: any) => conversation.users.some((cu: any) => compareObjectIds(cu, u))))
        throw new StatusError('At least one of the users is already in the conversation.', 400);

    // add users to conversation
    conversation.users = [...conversation.users, ...usersToAdd];
    conversation.visible_to = [...conversation.visible_to, ...usersToAdd];
    await conversation.save();
    await conversation.populate('users', USER_PREVIEW_FIELDS);

    return res.status(200).json(conversation.toObject());
};

/**
 * Removes auth'ed user from the conversation.
 * @route /conversation/leave/:conversation_id
 * @method POST
 * @requireAuth true
 * @return Updated conversation
 */
export const leaveConversation = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const conversation = await fetchDocument(req.params.conversation_id, ConversationModel);

    // check if auth'ed user is in conversation
    if (!conversation.users.some((id: string) => compareObjectIds(id, user._id))) throw new StatusError('Authed user is not in conversation.', 400);

    // remove auth'ed user from conversation
    conversation.users = conversation.users.filter((id: string) => !compareObjectIds(id, user._id));
    conversation.visible_to = conversation.visible_to.filter((id: string) => !compareObjectIds(id, user._id));
    await conversation.save();

    // delete conversation if less than 2 users
    if (conversation.users.length < 2) await ConversationModel.findOneAndDelete({ _id: conversation._id }).lean();

    return res.status(200).json(conversation);
};

/**
 * Gets all messages from a conversation.
 * @route /conversation/messages/:conversation_id?page=N
 * @method GET
 * @requireAuth true
 * @return Message[]
 */
export const getMessages = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const conversation = await fetchDocument(req.params.conversation_id, ConversationModel);

    // check if auth'ed user is in conversation
    if (!conversation.users.some((id: string) => compareObjectIds(id, user._id))) throw new StatusError('Authed user is not in conversation.', 400);

    const getData = async (lowerBound: number, pageSize: number) => {
        const messages = await MessageModel.find({ conversation: conversation._id })
            .sort({ createdAt: 'descending' })
            .skip(lowerBound)
            .limit(pageSize)
            .populate('sender', USER_PREVIEW_FIELDS)
            .lean();

        return messages;
    };

    const response = await paginatedFetchAsync(req.query, MESSAGE_PAGE_SIZE, getData);

    return res.status(200).json(response);
};

/**
 * Sends a message to the conversation.
 * @route /conversation/send-message/:conversation_id
 * @method POST
 * @requireAuth true
 * @return Message
 */
export const sendMessage = async (req: Request, res: Response) => {
    const { user, message } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'message', validator: validateMessage },
    ]);
    const conversation = await fetchDocument(req.params.conversation_id, ConversationModel, 'users');

    // check if auth'ed user is in conversation
    if (!conversation.users.some((u: any) => compareObjectIds(u._id, user._id))) throw new StatusError('Authed user is not in conversation.', 400);

    const newMessage = await MessageModel.create({
        sender: user._id,
        conversation: conversation._id,
        message,
        read_users: [user._id],
    });

    // update last_message
    conversation.last_message = newMessage._id;
    conversation.visible_to = conversation.users;

    await conversation.save();

    const newMessagePopulated: any = newMessage.toObject();
    newMessagePopulated.sender = {
        _id: user._id,
        display_name: user.display_name,
        avatar_uri: user.avatar_uri,
    };

    sendUsersPushNotifications(user, conversation.users, user.display_name, message, {
        type: 'message',
        conversation_id: conversation._id,
        picture_uri: user.avatar_uri,
    });

    return res.status(200).json(newMessagePopulated);
};

/**
 * Hides the authed user from the conversation.
 * @route /conversation/hide/:conversation_id
 * @method POST
 * @requireAuth true
 * @return "User hidden from conversation."
 */
export const hideAuthedUserFromConversation = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const conversation = await ConversationModel.findOne({ _id: req.params.conversation_id, users: { $in: [user._id] } });
    if (!conversation) throw new StatusError('Conversation does not exist.', 400);

    // remove auth'ed user from visible_to
    conversation.visible_to = conversation.visible_to.filter((id) => !compareObjectIds(id, user._id));
    await conversation.save();

    return res.status(200).json('User hidden from conversation.');
};
