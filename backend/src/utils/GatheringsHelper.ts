import { ObjectId } from 'mongoose';
import { ConversationModel } from '@models/conversation';
import { attachInvitedUserListToGathering, getGatheringInvitedUserList } from './NotificationsHelper';
import { USER_PREVIEW_FIELDS } from '@utils/Profiles';
import { fetchDocument } from '@utils/fetchDocument';
import { ONE_DAY_MS, compareObjectIds } from '@utils/validators/Validators';
import { convertDocumentsToIds } from '@utils/ArrayUtils';
import StatusError from './StatusError';
import { IGathering, GatheringModel } from '@/models/Place/gathering';
import { ViewModel } from '@/models/view';
import { ViewType } from '@/gathera-lib/enums/user';
import { NotificationModel } from '@/models/notification';
import { UserSuggestedGatheringsModel } from '@/models/User/userSuggestedGatherings';

/**
 * Gets the number of days until an event. Days can be fractional.
 * @param eventDate The date of the event.
 * @returns The number of days until the event. Negative if the event has already passed.
 */
export const getDaysUntilEvent = (eventDate: Date): number => {
    const currentDate = new Date();
    const timeDifference = eventDate.getTime() - currentDate.getTime();
    const daysDifference = timeDifference / ONE_DAY_MS; // Convert milliseconds to days
    return daysDifference;
};

/**
 * Gets a single gathering by id with populated user_list, requested_user_list, conversation and place name, and
 * attaches the invited user list to the gathering if authed user is in the gathering.
 * @param gatheringId id of the gathering to get
 * @param authedUserId id of the authed user
 * @returns Gathering
 * @throws Error if gathering not found
 */
export const getGatheringById = async (gatheringId: string, authedUserId: string | ObjectId) => {
    let gathering: IGathering | null = await GatheringModel.findById(gatheringId)
        .populate({
            path: 'user_list requested_user_list',
            select: USER_PREVIEW_FIELDS,
            populate: {
                path: 'follower_count',
            },
        })
        .populate('conversation')
        .populate('place', 'name')
        .lean();

    if (!gathering) throw new StatusError('Gathering not found.', 400);

    // Upsert a view for the gathering
    await ViewModel.findOneAndUpdate(
        { user: authedUserId, view_type: ViewType.GATHERING, gathering: gathering._id },
        { updatedAt: new Date() },
        { upsert: true, new: true }
    ).lean(); // Update the view if it exists, otherwise create it
    const views = await ViewModel.countDocuments({ gathering: gathering._id }).lean();

    if (isUserInGathering(gathering, authedUserId)) {
        gathering = await attachInvitedUserListToGathering(gathering);
    }

    return { ...gathering, views };
};

/**
 * Gets gatherings by query with populated user_list, requested_user_list, conversation and place name, and
 * attaches the invited user list to the gathering if authed used is in the gathering.
 * @param query The query to find the gathering with.
 * @param lowerBound The lower bound of the query.
 * @param limit The limit of the query.
 * @param authedUserId id of the authed user
 * @returns Gathering[]
 * @throws Error if gathering not found
 */
export const getGatheringsByQueryPaginated = async (query: any, lowerBound: number, limit: number, authedUserId: string | ObjectId) => {
    const gatherings: IGathering[] = await GatheringModel.find(query)
        .sort({ event_date: -1 })
        .skip(lowerBound)
        .limit(limit)
        .populate({
            path: 'user_list requested_user_list',
            select: USER_PREVIEW_FIELDS,
            populate: {
                path: 'follower_count',
            },
        })
        .populate('conversation')
        .populate('place', 'name')
        .lean();

    if (!gatherings) throw new Error('Gatherings not found.');

    const gatheringsToReturn: IGathering[] = [];
    for (const index in gatherings) {
        const isAuthedUserInGathering = isUserInGathering(gatherings[index], authedUserId);
        gatheringsToReturn.push(isAuthedUserInGathering ? await attachInvitedUserListToGathering(gatherings[index]) : gatherings[index]);
    }

    return gatheringsToReturn;
};

/**
 * Updates a gathering's conversation object user to list to reflect the
 * gathering's user_list. To be invoked whenever a gathering's user_list changes.
 *
 * **WARNING**: The gathering object should NOT have its conversation or user_list populated.
 * @param gathering The gathering document or object to sync the conversation for.
 * @returns Nothing.
 */
export const syncGatheringConversation = async (gathering: any) => {
    if (gathering.user_list.length === 0) return;
    const gatheringConversationId = gathering.conversation._id || gathering.conversation; // conversation is populated
    const conversation = await fetchDocument(gatheringConversationId, ConversationModel);

    const userList = convertDocumentsToIds(gathering.user_list);
    conversation.users = userList;
    conversation.visible_to = userList;
    await conversation.save();
};

/**
 * Checks if the user is in the provided gathering.
 * @param gathering The gathering document or object to determine if the user is in.
 * @param userId The user id to check if in the gathering.
 * @returns True if the user is in the gathering, false otherwise.
 */
export const isUserInGathering = (gathering: IGathering, userId: string | ObjectId) => {
    const userList = convertDocumentsToIds(gathering.user_list);
    return userList.some((gatheringUser: string | ObjectId) => compareObjectIds(gatheringUser, userId));
};

/**
 * Checks if the user has requested to join the provided gathering.
 * @param gathering The gathering document or object to determine if the user has requested to join.
 * @param userId The user id to check if has requested to join the gathering.
 * @returns True if the user has requested to join the gathering, false otherwise.
 */
export const hasUserRequestedToJoinGathering = (gathering: IGathering, userId: string | ObjectId) => {
    const requestedUserList = convertDocumentsToIds(gathering.requested_user_list);
    return requestedUserList.some((requestedUser: string | ObjectId) => compareObjectIds(requestedUser, userId));
};

/**
 * Checks if the user is the host of the provided gathering.
 * @param gathering The gathering document or object to determine if the user is the host of.
 * @param userId The user id to check if is the host of the gathering.
 * @returns True if the user is the host of the gathering, false otherwise.
 */
export const isUserHostOfGathering = (gathering: IGathering, userId: string | ObjectId) => {
    return compareObjectIds(gathering.host_user, userId);
};

/**
 * Checks if the user is invited to the provided gathering.
 * @param gathering The gathering document or object to determine if the user is invited to.
 * @param userId The user id to check if is invited to the gathering.
 * @returns True if the user is invited to the gathering, false otherwise.
 */
export const isUserInvitedToGatheringAsync = async (gathering: IGathering, userId: string | ObjectId) => {
    const invitedUserList = await getGatheringInvitedUserList(gathering._id);
    return invitedUserList.some((invitedUser: any) => compareObjectIds(invitedUser._id, userId));
};

/**
 * Determines if the gathering is full.
 * @param gathering The gathering document or object to determine if it is full.
 * @returns True if the gathering is full, false otherwise.
 */
export const isGatheringFull = (gathering: IGathering) => {
    return gathering.user_list.length >= gathering.max_count;
};

/**
 * Handles the deletion of a gathering by deleting all associated data. **Note**: This function does not delete the gathering itself.
 * @param gatheringId The id of the gathering to delete.
 */
export const gatheringDeletionHandler = async (gatheringId: string | ObjectId) => {
    const promises = [];

    // Delete the conversation associated with the gathering
    promises.push(ConversationModel.findOneAndDelete({ gathering: gatheringId }).lean());

    // Delete the notifications associated with the gathering
    promises.push(NotificationModel.deleteMany({ gathering: gatheringId }).lean());

    // Delete this gathering from suggested gatherings
    promises.push(UserSuggestedGatheringsModel.updateMany({}, { $pull: { suggested_gatherings: gatheringId } }));

    // Delete the views associated with the gathering
    promises.push(ViewModel.deleteMany({ gathering: gatheringId }).lean());

    await Promise.all(promises);
    console.log(`Deleted all gathering data ${gatheringId}`);
};
