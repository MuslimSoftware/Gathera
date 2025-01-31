import { ObjectId } from 'mongoose';
import { INotification, NotificationModel } from '@models/notification';
import { fetchDocument } from '@utils/fetchDocument';
import { compareObjectIds } from '@utils/validators/Validators';
import { UserDetailsModel } from '@models/User/userDetails';
import { ConversationModel } from '@models/conversation';
import { MessageModel } from '@models/message';
import { getUserInterestsAsync } from '@utils/InterestsHelper';
import { UserBorderModel } from '@models/User/userBorder';
import { UserInterestModel } from '@models/User/userInterest';
import { UserSettingsModel } from '@models/User/userSettings';
import { NotificationType } from '@lib/enums/notification';
import { GatheringModel } from '@/models/Place/gathering';
import { PlaceInterestModel } from '@/models/Place/placeInterest';
import { BlockModel } from '@/models/User/block';
import { FollowerModel, IFollower } from '@/models/User/follower';
import { ReportModel } from '@/models/User/report';
import { IUser, UserModel } from '@/models/User/user';
import { UserSuggestedGatheringsModel } from '@/models/User/userSuggestedGatherings';
import { UserAuthModel } from '@/models/User/userAuth';
import { ViewModel } from '@/models/view';
import { isUserHostOfGathering, isUserInGathering } from './GatheringsHelper';

export const USER_PREVIEW_FIELDS = '_id avatar_uri display_name subscription border';
export const USER_PREVIEW_FIELDS_WITH_FOLLOWERS = `${USER_PREVIEW_FIELDS} follower_count`;
export const USER_PREVIEW_FIELDS_WITH_FOLLOWERS_INTERESTS = `${USER_PREVIEW_FIELDS_WITH_FOLLOWERS} interests`;

export const PRIVATE_PROFILE_FIELDS = `${USER_PREVIEW_FIELDS} following_count follower_count bio interests is_public instagram_username`;
export const PUBLIC_PROFILE_FIELDS = `${PRIVATE_PROFILE_FIELDS} date_of_birth events money_spent money_saved`;

/**
 * Determines whether a user can view a profile's sensitive info.
 * @param user_id the user_id of the user requesting the profile
 * @param requestedUserId the user_id of the profile being requested
 * @param is_public Whether the profile is public
 * @param followers The list of followers of the profile as user_ids
 * @param isUserBlocked Whether the user is blocked
 * @returns true / false if the user can view the profile
 */
export const determinePermissions = (
    user_id: string,
    requestedUserId: string,
    is_public: boolean | undefined,
    isUserFollowing: boolean,
    isUserBlocked: boolean
) => {
    if (isUserBlocked) return false;

    return is_public || isUserFollowing || compareObjectIds(user_id, requestedUserId);
};

/**
 * Gets whether the auth'ed user is following the requested user.
 * @param user
 * @param requestedUserId
 * @returns boolean
 */
export const getIsFollowing = async (user: IUser, requestedUserId: string | ObjectId) => {
    return !!(await FollowerModel.exists({ user: requestedUserId, follower: user._id }).lean());
};

/**
 * Gets whether the auth'ed user has requested to follow the requested user.
 * @param user
 * @param requestedUserId
 * @returns boolean
 */
export const getIsRequested = async (user: IUser, requestedUserId: string | ObjectId) => {
    return !!(await NotificationModel.exists({
        user: requestedUserId,
        user_from: user._id,
        type: NotificationType.FollowReq,
    }).lean());
};

/**
 * Calculates the age of a user based on their date of birth.
 * @param date_of_birth
 * @returns age of user
 */
export const getAge = (date_of_birth: Date): number => {
    const currentDate = new Date();
    const birthdateObject = new Date(date_of_birth);

    let age = currentDate.getFullYear() - birthdateObject.getFullYear();

    // Check if the birthday has occurred this year
    if (
        currentDate.getMonth() < birthdateObject.getMonth() ||
        (currentDate.getMonth() === birthdateObject.getMonth() && currentDate.getDate() < birthdateObject.getDate())
    ) {
        age--;
    }

    return age;
};

/**
 * Gets a single user's profile with privacy settings applied.
 * @param user the auth'ed user document
 * @param requestedUserId the user id being requested
 * @returns the requested profile with privacy settings applied, isFollowing, isRequested, and isVisible
 */
export const fetchProfileWithPrivacy = async (user: IUser, requestedUserId: string | ObjectId) => {
    const requestedUser = await fetchDocument(requestedUserId, UserModel, {
        path: 'follower_count following_count gathering_count interests blocked_users',
    });

    const [isUserFollowing, isRequested, requestedUserBlocked, details, interests] = await Promise.all([
        getIsFollowing(user, requestedUserId),
        getIsRequested(user, requestedUserId),
        BlockModel.exists({ user: user._id, user_blocked: requestedUserId }).lean(),
        UserDetailsModel.findOne({ user: requestedUser._id }).lean(),
        getUserInterestsAsync(requestedUser._id),
    ]);

    const fullDetails: any = { ...details };
    if (details) {
        fullDetails.age = getAge(requestedUser.date_of_birth); // Attach age to details
        fullDetails.gender = requestedUser.gender; // Attach gender to details
    }

    const isAuthedUserBlocked: boolean = requestedUser.blocked_users.some((block: any) => {
        compareObjectIds(block.user_blocked, user._id);
    });

    const isProfileVisible: boolean = determinePermissions(
        user._id,
        requestedUser._id,
        requestedUser.is_public,
        isUserFollowing,
        isAuthedUserBlocked
    );

    const selectedFields: string = isProfileVisible ? PUBLIC_PROFILE_FIELDS : PRIVATE_PROFILE_FIELDS;
    const requestedUserObject = requestedUser.toObject ? requestedUser.toObject() : requestedUser;
    const userWithPrivacy = compareObjectIds(user._id, requestedUserObject._id)
        ? requestedUserObject
        : filterUserObject(requestedUserObject, selectedFields);

    return {
        ...userWithPrivacy,
        follower_count: requestedUser.follower_count,
        following_count: requestedUser.following_count,
        gathering_count: requestedUser.gathering_count,
        isFollowing: isUserFollowing,
        isRequested,
        isVisible: isProfileVisible,
        isAuthedUserBlocked,
        isRequestedUserBlocked: !!requestedUserBlocked,
        details: fullDetails,
        interests,
    };
};

/**
 * Gets a list of users' profile previews with isFollowing, isRequested, isBlocked.
 * @param user the auth'ed user document
 * @param requestedUsers the list of user documents being requested
 * @returns the requested profiles with privacy settings applied, follower_count, isFollowing, isRequested, isVisible, isBlocked
 */
export const fetchProfilesWithPrivacy = async (user: IUser, requestedUsers: IUser[]) => {
    const requestedUsersIds = requestedUsers.map((user: IUser) => user._id);

    const requestedUsersBeingFollowedPromise = FollowerModel.find({
        user: { $in: requestedUsersIds },
        follower: user._id,
    }).lean();

    const allFollowRequestsPromise = NotificationModel.find({ user_from: user._id, type: NotificationType.FollowReq }).lean();

    // gets all requested users that blocked the auth'ed user
    const allBlocksPromise = BlockModel.find({ user: { $in: requestedUsersIds }, user_blocked: user._id });

    // Await all promises
    let [requestedUsersBeingFollowed, allFollowRequests, allBlocks]: any = await Promise.all([
        requestedUsersBeingFollowedPromise,
        allFollowRequestsPromise,
        allBlocksPromise,
    ]);

    allBlocks = allBlocks.map((block: any) => block.user);

    // For each user, determine the visibility of their profile
    const requestedUsersWithPrivacy = requestedUsers.map((requestedUser: any) => {
        const isUserFollowing = requestedUsersBeingFollowed.some((follower: IFollower) => compareObjectIds(follower.user, requestedUser._id));
        const isRequested: boolean = allFollowRequests.some((notification: INotification) => compareObjectIds(notification.user, requestedUser._id));
        const isUserBlocked: boolean = allBlocks.some((block: any) => compareObjectIds(block, requestedUser._id));
        const isProfileVisible = determinePermissions(user._id, requestedUser._id, requestedUser.is_public, isUserFollowing, isUserBlocked);

        const requestedUserObject = requestedUser.toObject ? requestedUser.toObject() : requestedUser;
        const userWithPrivacy = filterUserObject(requestedUserObject, PRIVATE_PROFILE_FIELDS);

        return {
            ...userWithPrivacy,
            isFollowing: isUserFollowing,
            isVisible: isProfileVisible,
            isBlocked: isUserBlocked,
            isRequested,
        };
    });

    return requestedUsersWithPrivacy;
};

/**
 * Returns an object containing all the fields passed in.
 * @param user the user document
 * @param fields the fields to return as a string separated by spaces
 * @returns an object containing all the fields passed in if they exist
 */
const filterUserObject = (user: IUser, fields: string) => {
    const userObject = user.toObject ? user.toObject() : user;
    const selectedFields: string[] = fields.split(' ');

    const userWithPrivacy: any = {};
    for (let field of selectedFields) {
        if (field in userObject) {
            userWithPrivacy[field] = userObject[field];
        }
    }

    return userWithPrivacy;
};

/**
 * Deletes all data associated with a user. **Note**: This does not delete the user document itself.
 * @param user_id the user_id of the user to be deleted
 */
export const userDeletionHandler = async (user_id: string | ObjectId) => {
    const promises = [];

    // Delete all borders user owns
    promises.push(UserBorderModel.deleteMany({ user: user_id }).lean());

    // Delete all user details
    promises.push(UserDetailsModel.deleteMany({ user: user_id }).lean());

    // Delete all user interests
    promises.push(UserInterestModel.deleteMany({ user: user_id }).lean());

    // Delete all user settings
    promises.push(UserSettingsModel.deleteMany({ user: user_id }).lean());

    // Delete all blocks from user and to user
    promises.push(BlockModel.deleteMany({ $or: [{ user: user_id }, { user_blocked: user_id }] }).lean());

    // Delete user from all conversations they are in. If there is only 2 members in the non-gathering conversation, delete the conversation
    const convos: any = await ConversationModel.find({ $or: [{ users: user_id }, { visible_to: user_id }] }).populate('last_message');
    convos.forEach((convo: any) => {
        const userInConvo = convo.users.some((convoUser: ObjectId) => compareObjectIds(convoUser, user_id));

        if (userInConvo && convo.users.length === 2 && convo.gathering === undefined)
            promises.push(ConversationModel.findOneAndDelete({ _id: convo._id }).lean()); // Must use findOneAndDelete to trigger middleware
        else {
            convo.users = convo.users.filter((convoUser: ObjectId) => !compareObjectIds(convoUser, user_id));
            convo.visible_to = convo.visible_to.filter((convoUser: ObjectId) => !compareObjectIds(convoUser, user_id));
            if (convo.last_message && compareObjectIds((convo.last_message as any).sender, user_id)) convo.last_message = null;

            promises.push(convo.save());
        }
    });

    // Delete all gatherings they are in. If there is only 1 member in the gathering, delete the gathering
    const gatherings = await GatheringModel.find({ $or: [{ user_list: user_id }, { host_user: user_id }, { requested_user_list: user_id }] });
    gatherings.forEach((gathering) => {
        const userInGathering = isUserInGathering(gathering, user_id);
        const userIsHost = isUserHostOfGathering(gathering, user_id);

        if (userInGathering && gathering.user_list.length === 1) {
            // delete the gathering, findAndDelete to trigger deletion middleware
            promises.push(GatheringModel.findOneAndDelete({ _id: gathering._id }).lean());
        } else {
            // if they were the host, assign a new host then delete them from the user_list
            if (userIsHost) gathering.host_user = gathering.user_list.find((user: ObjectId) => !compareObjectIds(user, user_id))!;

            gathering.user_list = gathering.user_list.filter((gatheringUser: ObjectId) => !compareObjectIds(gatheringUser, user_id));
            gathering.requested_user_list = gathering.requested_user_list.filter(
                (gatheringUser: ObjectId) => !compareObjectIds(gatheringUser, user_id)
            );
            promises.push(gathering.save());
        }
    });

    // Delete all messages sent by the user
    promises.push(MessageModel.deleteMany({ sender: user_id }).lean());

    // Remove user from array of read_users in all messages
    promises.push(MessageModel.updateMany({ read_users: user_id }, { $pull: { read_users: user_id } }).lean());

    // Delete all notifications to the user & from the user
    promises.push(NotificationModel.deleteMany({ $or: [{ user: user_id }, { user_from: user_id }] }).lean());

    // Delete all place interests for this user
    promises.push(PlaceInterestModel.deleteMany({ user: user_id }).lean());

    // Delete all reports from & to the user
    promises.push(ReportModel.deleteMany({ $or: [{ user_from: user_id }, { user_reported: user_id }] }).lean());

    // Delete all followers of the user & from the user
    promises.push(FollowerModel.deleteMany({ $or: [{ user: user_id }, { follower: user_id }] }).lean());

    // Delete all suggested gatherings for the user
    promises.push(UserSuggestedGatheringsModel.deleteMany({ user: user_id }).lean());

    // Delete user auths
    promises.push(UserAuthModel.deleteMany({ user: user_id }).lean());

    // Delete user views & views of user
    promises.push(ViewModel.deleteMany({ $or: [{ user: user_id }, { profile: user_id }] }).lean());

    await Promise.all(promises);
    console.log(`Deleted all user data successfully ${user_id}`);
};
