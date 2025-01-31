import { compareObjectIds, validateBodyFields, validateObjectId } from '@utils/validators/Validators';
import { validateImageUrl, validateBoolean, validateFutureDate, validateString } from '@lib/validators/Validators';
import { validateConversationName } from '@lib/validators/ConversationValidators';
import { Request, Response } from 'express';
import StatusError from '@utils/StatusError';
import {
    validateGatheringEventDate,
    validateGatheringDescription,
    validateGatheringName,
    validateMaxGatheringCount,
} from '@lib/validators/GatheringValidators';
import { ObjectId } from 'mongoose';
import {
    getGatheringsByQueryPaginated,
    getGatheringById,
    syncGatheringConversation,
    isUserInGathering,
    isUserHostOfGathering,
    isGatheringFull,
    isUserInvitedToGatheringAsync,
    hasUserRequestedToJoinGathering,
} from '@utils/GatheringsHelper';
import { ConversationModel } from '@models/conversation';
import { fetchDocument } from '@utils/fetchDocument';
import { createInviteNotification, getGatheringInvitedUserList } from '@utils/NotificationsHelper';
import { USER_PREVIEW_FIELDS, fetchProfileWithPrivacy } from '@utils/Profiles';
import { SuggestedGatheringsAsync } from '@algorithms/SuggestedGatherings';
import { NotificationModel } from '@models/notification';
import { getPageFromQuery, paginatedFetchAsync } from '@utils/Pagination';
import { sendUsersPushNotifications } from '@utils/pushNotificationsHelper';
import { sanitizeUserInput } from '@utils/formatters/stringFormatting';
import { ViewModel } from '@models/view';
import { GATHERING_PAGE_SIZE, VIEW_PAGE_SIZE } from '@lib/constants/page-sizes';
import { NotificationType } from '@lib/enums/notification';
import { DEFAULT_GATHERING_COUNT, MAX_GATHERING_NAME_LENGTH } from '@lib/constants/gathering';
import { ellipsizeText } from '@/utils/formatters/stringFormatting';
import { UserSuggestedGatheringsModel } from '@/models/User/userSuggestedGatherings';
import { deleteFileAsync, getFilenameFromS3Url, getS3Url, getUploadUrlAsync } from '@/config/s3.config';
import { AWS_S3_GATHERING_PICTURES_BUCKET_NAME } from '@/config/env.config';
import { IGathering, GatheringModel } from '@/models/Place/gathering';
import { PlaceModel } from '@/models/Place/place';
import { IUser, UserModel } from '@/models/User/user';
import { consoleLogError } from '@/utils/ConsoleLog';

/**
 * Gets all gatherings from the database.
 * Accepts query param 'query' to search for gatherings by name or place name.
 * @route /gathering?query=X&page=N
 * @method GET
 * @requireAuth true
 * @return IGathering[]
 */
export const getGatherings = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    let { query } = req.query || '';
    let gatheringQuery = {};

    if (query) {
        query = sanitizeUserInput(query as string);
        const allPlacesMatchingQuery = await PlaceModel.find({ name: { $regex: query, $options: 'i' } })
            .select('_id')
            .lean();
        gatheringQuery = { $or: [{ place: { $in: allPlacesMatchingQuery } }, { gathering_name: { $regex: query, $options: 'i' } }] };
    }

    const getData = async (lowerBound: number, pageSize: number): Promise<IGathering[]> => {
        return await getGatheringsByQueryPaginated(gatheringQuery, lowerBound, pageSize, user._id);
    };

    const response = await paginatedFetchAsync(req.query, GATHERING_PAGE_SIZE, getData);

    return res.status(200).json(response);
};

/**
 * Gets all gatherings for specific place_id.
 * @route /gathering/place/:place_id?page=N
 * @method GET
 * @requireAuth true
 * @return IGathering[]
 */
export const getAllFutureGatheringsByPlaceId = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { place_id } = req.params;

    await fetchDocument(place_id, PlaceModel); // check if place exists

    const getData = async (lowerBound: number, pageSize: number): Promise<IGathering[]> => {
        return await getGatheringsByQueryPaginated(
            { place: place_id, $or: [{ event_date: { $exists: true, $gte: new Date() } }, { event_date: { $exists: false } }] },
            lowerBound,
            pageSize,
            user._id
        );
    };

    const response = await paginatedFetchAsync(req.query, GATHERING_PAGE_SIZE, getData);

    return res.status(200).json(response);
};

/**
 * Gets all user's gatherings by user_id.
 * @route /gathering/user/:user_id?page=N
 * @method GET
 * @requireAuth true
 * @return IGathering[]
 */
export const getGatheringsByUserId = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { user_id } = req.params;

    // Determine privacy permissions
    const { isVisible } = await fetchProfileWithPrivacy(user, user_id);
    if (!isVisible) throw new StatusError('User is private.', 400);

    const getData = async (lowerBound: number, pageSize: number): Promise<IGathering[]> => {
        return await getGatheringsByQueryPaginated({ user_list: user_id }, lowerBound, pageSize, user._id);
    };

    const response = await paginatedFetchAsync(req.query, GATHERING_PAGE_SIZE, getData);

    return res.status(200).json(response);
};

/**
 * Gets a gathering by id.
 * @route /gathering/get/:gathering_id
 * @method GET
 * @requireAuth true
 * @return IGathering[]
 */
export const getFullGatheringById = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const gathering = await getGatheringById(req.params.gathering_id, user._id);
    return res.status(200).json(gathering);
};

/**
 * Creates a new gathering
 * @route /gathering/create
 * @method POST
 * @requireAuth true
 * @return The created gathering
 */
export const createGathering = async (req: Request, res: Response) => {
    let { user, place_id, gathering_name, gathering_description, event_date, is_private, gathering_pic, max_count } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'place_id', validator: validateObjectId },
        { field: 'is_private', validator: validateBoolean },

        // Optional fields
        { field: 'gathering_name', validator: [validateGatheringName, validateConversationName], required: false },
        { field: 'gathering_description', validator: validateGatheringDescription, required: false },
        { field: 'event_date', validator: validateGatheringEventDate, required: false },
        { field: 'gathering_pic', validator: validateImageUrl, required: false },
        { field: 'max_count', validator: validateMaxGatheringCount, required: false },
    ]);

    // Format fields
    const namePostfix = "'s Gathering";
    gathering_name = gathering_name || `${user.display_name.slice(0, MAX_GATHERING_NAME_LENGTH - namePostfix.length)}${namePostfix}`;
    gathering_description = gathering_description || '';
    max_count = max_count || DEFAULT_GATHERING_COUNT;
    event_date = event_date ? new Date(event_date) : undefined;

    const place = await fetchDocument(place_id, PlaceModel); // check if place exists

    // Create gathering conversation
    const conversation = await ConversationModel.create({
        users: [user._id],
        conversation_name: gathering_name,
        visible_to: [user._id],
    });

    const gatheringData: any = {
        host_user: user._id,
        place: place._id,
        user_list: [user._id],
        gathering_name: gathering_name,
        gathering_description: gathering_description,
        max_count,
        conversation: conversation._id,
        is_private,
    };

    if (gathering_pic) gatheringData.gathering_pic = gathering_pic;
    if (event_date) gatheringData.event_date = event_date;

    // Create gathering and attach to conversation
    const gathering = await GatheringModel.create(gatheringData);
    conversation.gathering = gathering._id;
    await conversation.save();

    const gatheringPopulated = await getGatheringById(gathering._id, user._id);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Updates gathering document in db
 * @route /gathering/update/:gathering_id
 * @method PATCH
 * @requireAuth true
 * @return The updated gathering
 */
export const updateGathering = async (req: Request, res: Response) => {
    const { user, host_user_id, gathering_name, gathering_description, max_count, event_date, is_private } = validateBodyFields(req.body, [
        // Required fields
        'user',

        // Optional fields
        { field: 'host_user_id', validator: validateObjectId, required: false },
        { field: 'gathering_name', validator: [validateGatheringName, validateConversationName], required: false },
        { field: 'gathering_description', validator: validateGatheringDescription, required: false },
        { field: 'max_count', validator: validateMaxGatheringCount, required: false },
        { field: 'event_date', validator: validateGatheringEventDate, required: false },
        { field: 'is_private', validator: validateBoolean, required: false },
    ]);
    const gathering = await fetchDocument(req.params.gathering_id, GatheringModel);

    if (!isUserHostOfGathering(gathering, user._id)) throw new StatusError('Only the host can update the gathering.', 400);

    if (host_user_id) {
        // update host if the user is in the gathering
        const newHostUser = await fetchDocument(host_user_id, UserModel);
        if (!isUserInGathering(gathering, newHostUser._id)) throw new StatusError('User is not in the gathering.', 400);
        gathering.host_user = newHostUser._id;
    }

    if (gathering_name) {
        gathering.gathering_name = gathering_name;
        const conversation = await fetchDocument(gathering.conversation, ConversationModel);
        conversation.conversation_name = gathering_name;
        await conversation.save();
    }

    if (gathering_description) {
        gathering.gathering_description = gathering_description;
    }

    if (max_count) {
        if (max_count < gathering.user_list.length) throw new StatusError('Cannot set max count to less than current user count.', 400);
        gathering.max_count = max_count;
    }

    if (event_date) {
        gathering.event_date = new Date(event_date);
    }

    if (is_private !== undefined) {
        gathering.is_private = is_private;

        if (!is_private) {
            // add pending users to user_list until max_count is reached since gathering is now public
            for (const id of gathering.requested_user_list) {
                if (isGatheringFull(gathering)) break;
                gathering.user_list.push(id);
            }
            gathering.requested_user_list = []; // clear requested users
        }
    }

    await gathering.save();
    const gatheringPopulated = await getGatheringById(gathering._id, user._id);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Invites a user to a gathering. Adds them to the pending_users_list if they are not
 * already in it.
 * @route /gathering/invite/:gathering_id
 * @method POST
 * @requireAuth true
 * @return The updated gathering
 */
export const inviteUserToGathering = async (req: Request, res: Response) => {
    const { user, user_id_to_add } = validateBodyFields(req.body, ['user', { field: 'user_id_to_add', validator: validateObjectId }]);

    const [gathering, userToAdd] = await Promise.all([
        fetchDocument(req.params.gathering_id, GatheringModel),
        fetchDocument(user_id_to_add, UserModel, 'blocked_users'),
    ]);

    // check if user is blocked
    if (userToAdd.blocked_users.some((block: any) => compareObjectIds(block.user_blocked, user._id)))
        throw new StatusError('Cannot invite this user because they have blocked you.', 400);

    if (isGatheringFull(gathering)) throw new StatusError('Gathering is full.', 400);
    if (isUserInGathering(gathering, userToAdd._id)) throw new StatusError('User is already in the gathering.', 400);
    if (!isUserInGathering(gathering, user._id)) throw new StatusError('You must be in the gathering to invite users.', 400);
    if (await isUserInvitedToGatheringAsync(gathering, userToAdd._id)) throw new StatusError('User has already been invited.', 400);

    if (hasUserRequestedToJoinGathering(gathering, userToAdd._id)) {
        // user has already requested to join, redirect to respondToJoinRequest w/ join=true
        req.body.join = true;
        req.body.requesting_user_id = userToAdd._id;

        // TODO: send join success notification to user who requested to join
        return respondToJoinRequest(req, res);
    }

    // Send notification to user who was invited
    createInviteNotification(user, userToAdd, gathering._id, gathering.place);

    const gatheringPopulated = await getGatheringById(gathering._id, user._id);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Handles accept/reject reponse to gathering invite.
 * @route /gathering/respond-invite/:notification_id
 * @method POST
 * @requireAuth true
 * @return The updated gathering
 */
export const respondToGatheringInvite = async (req: Request, res: Response) => {
    const { user, join } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'join', validator: validateBoolean },
    ]);

    const notification = await fetchDocument(req.params.notification_id, NotificationModel);
    if (notification.type !== NotificationType.Invite || !notification.gathering)
        throw new StatusError('Cannot respond to invite because notification does not have a gathering associated with it.', 400);

    const gathering = await fetchDocument(notification.gathering, GatheringModel);

    if (join) {
        // user accepted invite
        if (isGatheringFull(gathering)) throw new StatusError('Gathering is full.', 400);
        else if (isUserInGathering(gathering, user._id)) throw new StatusError('User is already in the gathering.', 400);
        else if (!(await isUserInvitedToGatheringAsync(gathering, user._id))) throw new StatusError('User has not been invited.', 400);
        else {
            // No errors --> add user to gathering
            gathering.user_list.push(user._id);
            await gathering.save();

            // Update conversation with new user
            await syncGatheringConversation(gathering);

            // Send push notifications to users in gathering
            await gathering.populate('user_list');
            sendUsersPushNotifications(
                user,
                gathering.user_list,
                gathering.gathering_name,
                `${ellipsizeText(user.display_name, 15)} has joined the gathering!`,
                {
                    gatheringId: gathering._id,
                    type: 'gathering-join',
                }
            );
        }
    }

    const [gatheringPopulated] = await Promise.all([
        getGatheringById(gathering._id, user._id),
        NotificationModel.findByIdAndDelete(notification._id), // delete the invite notification
    ]);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Joins a gathering. Adds user to user_list if gathering is public, or requested_user_list if gathering is private.
 * @route /gathering/join/:gathering_id
 * @method POST
 * @requireAuth true
 * @return Updated gathering
 */
export const joinGathering = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const gathering = await fetchDocument(req.params.gathering_id, GatheringModel);

    if (!validateFutureDate(gathering.event_date)) throw new StatusError('Cannot join gathering because it has already passed.', 400);
    if (isGatheringFull(gathering)) throw new StatusError('Gathering is full.', 400);
    if (isUserInGathering(gathering, user._id)) throw new StatusError('User is already in the gathering.', 400);
    if (await isUserInvitedToGatheringAsync(gathering, user._id)) {
        // user is joining a gathering that they are currently inv to
        // redirect to respondToGatheringInvite w/ join=true

        // find notification id corresponding to gathering invite
        const invNotification = await NotificationModel.findOne({ type: NotificationType.Invite, gathering: gathering._id, user: user._id });
        if (!invNotification) throw new StatusError('User is in invited list, but no invite notification found.', 400);

        req.params.notification_id = invNotification._id.toString();
        req.body.join = true;

        return respondToGatheringInvite(req, res);
    }

    if (!gathering.is_private) {
        // gathering is public --> join
        gathering.user_list.push(user._id);

        // Update conversation with new user
        await syncGatheringConversation(gathering);

        await gathering.populate('user_list');
        sendUsersPushNotifications(
            user,
            gathering.user_list,
            gathering.gathering_name,
            `${ellipsizeText(user.display_name, 15)} has joined the gathering!`,
            {
                gatheringId: gathering._id,
                type: 'gathering-join',
            }
        );
    }

    if (gathering.is_private) {
        // gathering is private & user is not already invited --> add user to requested_user_list
        if (hasUserRequestedToJoinGathering(gathering, user._id)) throw new StatusError('User already requested to join.', 400);

        gathering.requested_user_list.push(user._id);
        await gathering.populate('user_list');
        sendUsersPushNotifications(
            user,
            gathering.user_list,
            gathering.gathering_name,
            `${ellipsizeText(user.display_name, 15)} has requested to join!`,
            {
                gatheringId: gathering._id,
                type: 'gathering-join',
            }
        );
    }
    await gathering.save();

    const gatheringPopulated = await getGatheringById(gathering._id, user._id);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Removes user from gathering
 * @route /gathering/remove-user/:gathering_id
 * @method POST
 * @requireAuth true
 * @return The updated gathering
 */
export const removeUserFromGathering = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const gathering = await fetchDocument(req.params.gathering_id, GatheringModel);

    // verify user is in gathering
    if (!isUserInGathering(gathering, user._id)) throw new StatusError('User is not in gathering.', 400);

    // if host leaves either auto assign new host or delete gathering if no users left
    if (isUserHostOfGathering(gathering, user._id)) {
        if (gathering.user_list.length > 1) {
            // assign new host
            for (const id of gathering.user_list) {
                if (!compareObjectIds(id, user._id)) {
                    gathering.host_user = id;
                    break;
                }
            }
        } else {
            // delete gathering because no users remain
            // redirect to deleteGathering function
            return deleteGathering(req, res);
        }
    }

    // remove user from gathering
    gathering.user_list = gathering.user_list.filter((id: ObjectId) => !compareObjectIds(id, user._id));
    await gathering.save();

    // Remove user from conversation
    await syncGatheringConversation(gathering);

    const gatheringPopulated = await getGatheringById(gathering._id, user._id);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Deletes a gathering.
 * @route /gathering/delete/:gathering_id
 * @method DELETE
 * @requireAuth true
 * @return The deleted gathering
 */
export const deleteGathering = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const gathering = await fetchDocument(req.params.gathering_id, GatheringModel);
    if (!isUserHostOfGathering(gathering, user._id)) throw new StatusError('Must be the host of the gathering to delete it.', 400);

    // Delete all notifications associated with gathering
    const deleteNotifsPromise = NotificationModel.deleteMany({ gathering: gathering._id }).lean();

    // Delete gathering (middleware will delete the gathering conversation)
    const deletedGatheringPromise = GatheringModel.findOneAndDelete({ _id: gathering._id }).lean();

    const [deletedGathering] = await Promise.all([deletedGatheringPromise, deleteNotifsPromise]);
    return res.status(200).json(deletedGathering);
};

/**
 * Handles accept/reject reponse to gathering join request.
 * @route /gathering/respond-to-request/:gathering_id
 * @method POST
 * @requireAuth true
 * @return Updated gathering
 */
export const respondToJoinRequest = async (req: Request, res: Response) => {
    const { user, requesting_user_id, join } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'requesting_user_id', validator: validateObjectId },
        { field: 'join', validator: validateBoolean },
    ]);

    const [gathering, requestedUser] = await Promise.all([
        fetchDocument(req.params.gathering_id, GatheringModel),
        fetchDocument(requesting_user_id, UserModel), // verify requested user exists
    ]);

    // verify authenticated user is in the gathering
    if (!isUserInGathering(gathering, user._id)) throw new StatusError('Must be in gathering to respond to join request.', 400);

    if (!join) {
        // User has been rejected from joining the gathering --> remove them from requested_user_list
        gathering.requested_user_list = gathering.requested_user_list.filter((userId: any) => !compareObjectIds(userId, requestedUser._id));
        await gathering.save();

        const gatheringPopulated = await getGatheringById(gathering._id, user._id);
        return res.status(200).json(gatheringPopulated);
    }

    if (isGatheringFull(gathering)) throw new StatusError('Gathering is full.', 400);
    if (isUserInGathering(gathering, requestedUser._id)) throw new StatusError('User is already in the gathering.', 400);
    if (!hasUserRequestedToJoinGathering(gathering, requestedUser._id)) throw new StatusError('User has not requested to join.', 400);

    if (join) {
        // user accepted invite to join --> add user to gathering
        gathering.user_list.push(requesting_user_id);

        // user is now in the gathering, remove them from requested list
        gathering.requested_user_list = gathering.requested_user_list.filter((user_id: any) => !compareObjectIds(user_id, requestedUser._id));
        await gathering.save();

        // Update conversation with new user
        await syncGatheringConversation(gathering);
    }

    const gatheringPopulated = await getGatheringById(gathering._id, user._id);
    return res.status(200).json(gatheringPopulated);
};

/**
 * Gets suggested gatherings for the authenticated user.
 * @route /gathering/suggested?page=N
 * @method GET
 * @requireAuth true
 * @return An array of suggested gatherings sorted by trendingScore in descending order.
 */
export const getSuggestedGatherings = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { lowerBound, upperBound } = getPageFromQuery(req.query, GATHERING_PAGE_SIZE);

    const fetchSuggestions = async () => {
        const suggestions = await UserSuggestedGatheringsModel.findOne({ user: user._id })
            .populate({ path: 'suggested_gatherings', populate: { path: 'user_list', select: USER_PREVIEW_FIELDS } })
            .populate({ path: 'suggested_gatherings', populate: { path: 'place', select: 'name' } })
            .lean();
        return suggestions ? suggestions.suggested_gatherings : [];
    };

    let suggestions = await fetchSuggestions();
    if (!suggestions || suggestions.length === 0) {
        // no suggestions or they are outdated --> generate new suggestions
        await SuggestedGatheringsAsync(user._id); // generate suggestions for user in the db
        suggestions = await fetchSuggestions(); // fetch the newly generated suggestions from the db
    }

    const data = suggestions.slice(lowerBound, upperBound); // paginate the data
    const hasMore = upperBound < suggestions.length; // determine if there is more data to fetch
    return res.status(200).json({ data, hasMore });
};

/**
 * Gets all users invited to the gathering.
 * @route /gathering/invited-users/:gathering_id
 * @method GET
 * @requireAuth true
 * @return The invited users as UserPreview[]
 */
export const getInvitedUsers = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { gathering_id } = req.params;
    const gathering = await fetchDocument(gathering_id, GatheringModel);

    // verify authenticated user is in the gathering
    if (!isUserInGathering(gathering, user._id)) throw new StatusError('Must be in gathering to get invited users.', 400);

    const invitedUsers = await getGatheringInvitedUserList(gathering_id);
    return res.status(200).json(invitedUsers);
};

/**
 * Gets the detailed views for a gathering by gathering ID paginated if the auth'ed user is premium.
 * @route /gathering/views-details/:gathering_id?page=N
 * @method GET
 * @requireAuth true
 * @requireSubscription true
 * @return The views for a gathering by gathering ID paginated.
 */
export const getGatheringViewsDetails = async (req: Request, res: Response) => {
    const { gathering_id } = req.params;

    await fetchDocument(gathering_id, GatheringModel); // Make sure the gathering exists

    const getData = async (lowerBound: number, pageSize: number): Promise<IGathering[]> => {
        return await ViewModel.find({ gathering: gathering_id })
            .sort({ updatedAt: -1 })
            .skip(lowerBound)
            .limit(pageSize)
            .populate('user', USER_PREVIEW_FIELDS)
            .select('-createdAt -__v')
            .lean();
    };

    const response = await paginatedFetchAsync(req.query, VIEW_PAGE_SIZE, getData);
    return res.status(200).json(response);
};

/**
 * Returns a pre-signed url for uploading a file to S3
 * @route /gathering/pre-signed-url/:gathering_id
 * @method GET
 * @requireAuth true
 * @return The pre-signed url and filename
 */
export const getGatheringPreSignedUrl = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { gathering_id } = req.params;

    const gathering = await fetchDocument(gathering_id, GatheringModel);
    if (!isUserInGathering(gathering, user._id)) throw new StatusError('User is not in gathering.', 400);
    if (!isUserHostOfGathering(gathering, user._id)) throw new StatusError('User is not host of gathering.', 400);

    const filename = `${gathering_id}-${Date.now()}`;
    const url = await getUploadUrlAsync(filename, AWS_S3_GATHERING_PICTURES_BUCKET_NAME);

    return res.status(200).json({ url, filename });
};

/**
 * Saves the gathering picture after it has been uploaded to S3 from a pre-signed url.
 * @route /gathering/pre-signed-url/:gathering_id
 * @method POST
 * @requireAuth true
 * @return The updated gathering's picture url
 */
export const saveGatheringPictureFromPreSignedUrl = async (req: Request, res: Response) => {
    const { user, filename } = validateBodyFields(req.body, ['user', { field: 'filename', validator: validateString }]);
    const { gathering_id } = req.params;

    const gathering = await fetchDocument(gathering_id, GatheringModel);
    if (!isUserInGathering(gathering, user._id)) throw new StatusError('User is not in gathering.', 400);
    if (!isUserHostOfGathering(gathering, user._id)) throw new StatusError('User is not host of gathering.', 400);

    // Delete old gathering picture if it exists
    if (gathering.gathering_pic && gathering.gathering_pic.toLowerCase().includes('amazonaws.com')) {
        const oldFilename = getFilenameFromS3Url(gathering.gathering_pic);
        await deleteFileAsync(oldFilename, AWS_S3_GATHERING_PICTURES_BUCKET_NAME).catch((error) => {
            consoleLogError(`Failed to delete old gathering picture [${gathering.gathering_pic}]. ${error}`);
        });
    }

    // Save new gathering picture
    gathering.gathering_pic = getS3Url(filename, AWS_S3_GATHERING_PICTURES_BUCKET_NAME);
    await gathering.save();

    return res.status(200).json(gathering.gathering_pic);
};
