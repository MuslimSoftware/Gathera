import { capitalizeAndTrim } from '@utils/formatters/authFormatting';
import { Request, Response } from 'express';
import StatusError from '@utils/StatusError';
import { compareObjectIds, validateBodyFields } from '@utils/validators/Validators';
import { validateArray, validateBoolean, validateString } from '@lib/validators/Validators';
import {
    fetchProfileWithPrivacy,
    fetchProfilesWithPrivacy,
    USER_PREVIEW_FIELDS,
    USER_PREVIEW_FIELDS_WITH_FOLLOWERS,
    userDeletionHandler,
    getAge
} from '@utils/Profiles';
import { fetchDocument } from '@utils/fetchDocument';
import { createFollowNotification, createFollowRequestNotification } from '@utils/NotificationsHelper';
import { INotification, NotificationModel } from '@models/notification';
import { paginatedFetchAsync } from '@utils/Pagination';
import { IUserDetails, UserDetailsModel } from '@models/User/userDetails';
import { getInterestDocumentIds, getUserInterestsAsync } from '@utils/InterestsHelper';
import { ConversationModel, IConversation } from '@models/conversation';
import { deleteFileAsync, getFilenameFromS3Url, getS3Url, getUploadUrlAsync } from '@config/s3.config';
import { consoleLogError, consoleLogWarning } from '@utils/ConsoleLog';
import { UserInterestModel } from '@models/User/userInterest';
import { UserSettingsModel } from '@models/User/userSettings';
import { UserBorderModel } from '@models/User/userBorder';
import { sanitizeUserInput } from '@utils/formatters/stringFormatting';
import { PLACES_DISPLAY_FIELDS, addPhotosToPlaces } from '@utils/Places';
import { ViewModel } from '@models/view';
import { USER_PAGE_SIZE, PLACE_PAGE_SIZE, VIEW_PAGE_SIZE } from '@lib/constants/page-sizes';
import { NotificationType } from '@lib/enums/notification';
import {
    ViewType,
    Detail,
    EducationValues,
    FrequencyValues,
    FitnessValues,
    PoliticsValues,
    ReligionValues,
    ZodiacValues,
    SubscriptionType
} from '@lib/enums/user';
import { MAX_BIO_LENGTH, MAX_INSTAGRAM_USERNAME_LENGTH, MAX_DETAIL_VALUE_LENGTH, MAX_NATIONALITY_COUNT } from '@lib/constants/user';
import {
    validateBio,
    validateInstagramUsername,
    validateLastName,
    validateName,
    validateBorder,
    validateEmail,
    validateDisplayName,
    validateReportReason,
    validateReportDescription,
    validateUserSettingField,
    validateHeight,
    validateNationalities,
    validateFeedback,
    validateRatings
} from '@lib/validators/UserValidators';
import { validatePushToken } from '@/utils/validators/UserValidators';
import { AWS_S3_PROFILE_PICTURES_BUCKET_NAME } from '@/config/env.config';
import { PlaceInterestModel } from '@/models/Place/placeInterest';
import { BlockModel } from '@/models/User/block';
import { FollowerModel, IFollower } from '@/models/User/follower';
import { ReportModel } from '@/models/User/report';
import { UserModel, IUser } from '@/models/User/user';
import { sendPushNotificationToAdmins } from '@/config/push.config';
import { FeedbackModel } from '@/models/User/feedback';

/**
 * Gets all users' profiles.
 * @route /user/all-users?display_name=Xpage=N
 * @method GET
 * @requireAuth true
 * @return IUser[]
 */
export const getAllUserProfiles = async (req: Request, res: Response) => {
    const { user: auth_user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    let { display_name } = req.query;

    display_name = display_name ? sanitizeUserInput(display_name as string) : ''; // Sanitize user input

    // Get all users with the query string in their display_name other than auth_user
    const getData = async (lowerBound: number, pageSize: number) => {
        return await UserModel.find({
            display_name: { $regex: display_name, $options: 'i' },
            _id: { $ne: auth_user._id }
        })
            .skip(lowerBound)
            .limit(pageSize);
    };

    const { data, hasMore } = await paginatedFetchAsync(req.query, USER_PAGE_SIZE, getData);
    const allUsersWithPrivacy = await fetchProfilesWithPrivacy(auth_user, data);

    return res.status(200).json({ data: allUsersWithPrivacy, hasMore });
};

/**
 * Gets the authenticated user.
 * @route /user/
 * @method GET
 * @requireAuth true
 * @return The authenticated user with details and interests.
 */
export const getAuthenticatedUser = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const [details, interests] = await Promise.all([
        UserDetailsModel.findOne({ user: user._id }).select('-user').lean(),
        getUserInterestsAsync(user._id)
    ]);

    return res.status(200).json({ ...user.toObject(), details, interests });
};

/**
 * Gets a profile by user_id if allowed by privacy.
 * @route /user/profile/get/:id
 * @method GET
 * @requireAuth true
 * @return The requested profile
 */
export const getProfileById = async (req: Request, res: Response) => {
    const { id: requestedUserId } = req.params;
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);

    // Get the requested profile with privacy
    const requestedProfile = await fetchProfileWithPrivacy(user, requestedUserId);

    // Upsert a view for the requested profile if the user is not viewing their own profile
    if (!compareObjectIds(user._id, requestedProfile._id)) {
        await ViewModel.findOneAndUpdate(
            { user: user._id, view_type: ViewType.PROFILE, profile: requestedProfile._id },
            { updatedAt: new Date() },
            { upsert: true, new: true }
        ).lean(); // Update the view if it exists, otherwise create it
    }

    const views = await ViewModel.countDocuments({ profile: requestedUserId }).lean();
    return res.status(200).json({ ...requestedProfile, views });
};

/**
 * Updates the authenticated user's profile with their user_id.
 * @route /user/profile/update
 * @method PATCH
 * @requireAuth true
 * @return { user_id: string, ...profile }
 */
export const updateAuthenticatedUser = async (req: Request, res: Response) => {
    const { user, fields } = validateBodyFields(req.body, ['user', 'fields']);
    const fieldWhiteList: Set<string> = new Set(['bio', 'border', 'display_name', 'email', 'fname', 'instagram_username', 'is_public', 'lname']);

    const updateObject: any = {};
    for (const fieldName in fields) {
        if (!fieldWhiteList.has(fieldName)) continue; // Skip fields that are not allowed to be updated
        if (fields[fieldName] === undefined || fields[fieldName] === null) continue; // Skip fields that are undefined/null (not provided)
        if (fields[fieldName] === user[fieldName]) continue; // Skip fields that are unchanged

        switch (fieldName) {
            case 'bio':
                if (!validateString(fields[fieldName])) throw new StatusError('Invalid bio.', 400);

                const bioTrimmed = fields[fieldName].trim();
                if (!validateBio(bioTrimmed)) throw new StatusError(`Bio must be less than ${MAX_BIO_LENGTH} characters.`, 400);

                updateObject[fieldName] = bioTrimmed;
                break;

            case 'border':
                const border = fields[fieldName];
                if (!validateBorder(border)) throw new StatusError('Invalid border.', 400);
                if (user.subscription === SubscriptionType.FREE) throw new StatusError('You must have Gathera Premium to use borders.', 403);

                const bordersOwned = (await UserBorderModel.find({ user: user._id }).lean()).map((border) => border.border_owned);
                if (!bordersOwned.includes(border)) throw new StatusError('You do not own this border.', 400);

                updateObject[fieldName] = fields[fieldName];
                break;

            case 'display_name':
                if (!validateString(fields[fieldName])) throw new StatusError('Invalid display name.', 400);
                const displayNameTrimmed = fields[fieldName].trim();
                if (!validateDisplayName(displayNameTrimmed)) throw new StatusError(`Invalid display_name`, 400);

                updateObject[fieldName] = displayNameTrimmed;
                break;

            case 'email':
                if (!validateString(fields[fieldName])) throw new StatusError('Invalid email.', 400);
                const emailTrimmed = fields[fieldName].trim().toLowerCase();
                if (emailTrimmed.length > 320) throw new StatusError('Email must be less than 320 characters.', 400);
                if (!validateEmail(emailTrimmed)) throw new StatusError('Invalid email.', 400);

                const emailDocument = await UserModel.findOne({ email: emailTrimmed }).lean();
                if (emailDocument) throw new StatusError('Email already in use.', 400);

                updateObject[fieldName] = emailTrimmed;
                break;

            case 'fname':
                if (!validateString(fields[fieldName])) throw new StatusError('Invalid first name.', 400);
                const fnameTrimmed = capitalizeAndTrim(fields[fieldName]);
                if (!validateName(fnameTrimmed)) throw new StatusError(`First Name is invalid.`, 400);

                updateObject[fieldName] = capitalizeAndTrim(fnameTrimmed);
                break;

            case 'lname':
                if (!validateString(fields[fieldName])) throw new StatusError('Invalid last name.', 400);
                const lnameTrimmed = capitalizeAndTrim(fields[fieldName]);
                if (!validateLastName(lnameTrimmed)) throw new StatusError(`Last Name is invalid.`, 400);

                updateObject[fieldName] = lnameTrimmed;
                break;

            case 'instagram_username':
                if (!validateString(fields[fieldName])) throw new StatusError('Invalid Instagram username.', 400);
                const instagramUsernameTrimmed = fields[fieldName].trim().toLowerCase();
                if (!validateInstagramUsername(instagramUsernameTrimmed))
                    throw new StatusError(`Instagram username must be less than ${MAX_INSTAGRAM_USERNAME_LENGTH} characters.`, 400);

                updateObject[fieldName] = instagramUsernameTrimmed;
                break;

            case 'is_public':
                if (!validateBoolean(fields[fieldName])) throw new StatusError('Invalid is_public.', 400);
                const isPublic = fields[fieldName] as boolean;
                updateObject[fieldName] = isPublic;

                // If user switches from private to public, grant all follows & change follow requests to follows
                if (!user.is_public && isPublic) {
                    const allFollowRequests = await NotificationModel.find({ user: user._id, type: NotificationType.FollowReq }).lean();
                    await Promise.all([
                        FollowerModel.create(
                            allFollowRequests.map(followRequest => ({
                                user: user._id,
                                follower: followRequest.user_from
                            }))
                        ),
                        NotificationModel.updateMany(
                            { user: user._id, type: NotificationType.FollowReq },
                            { $set: { type: NotificationType.Follow } }
                        )
                    ]);
                }
                break;

            default:
                consoleLogWarning(`Unhandled field: ${fieldName}`);
                break;
        }
    }

    const updatedUser: any = await UserModel.findOneAndUpdate({ _id: user._id }, { $set: updateObject }, { new: true });
    if (!updatedUser) throw new StatusError('Update operation failed.', 400);

    const requestedProfile = await fetchProfileWithPrivacy(updatedUser, updatedUser._id);
    return res.status(200).json(requestedProfile);
};

/**
 * Gets the user's followers list with details if allowed by privacy.
 * @route /user/profile/followers/:id?page=N
 * @method GET
 * @requireAuth true
 * @return all followers as UserPreview[]
 */
export const getFollowersById = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { id: requestedUserId } = req.params;

    const requestedProfile = await fetchProfileWithPrivacy(user, requestedUserId);
    const { isVisible } = requestedProfile;
    if (!isVisible) throw new StatusError('You are not authorized to view this profile.', 403);

    const getData = async (lowerBound: number, pageSize: number) => {
        return await FollowerModel.find({ user: requestedUserId })
            .skip(lowerBound)
            .limit(pageSize)
            .select('-_id follower')
            .populate('follower', USER_PREVIEW_FIELDS)
            .lean();
    };

    const { data, hasMore } = await paginatedFetchAsync(req.query, USER_PAGE_SIZE, getData);

    // Check if user is following each user in the list
    const followersListIds = data.map((follower: any) => follower.follower._id);
    const authedUserFollowing = await FollowerModel.find({ follower: user._id, user: { $in: followersListIds } }).lean();

    const followers = data.map((followDoc: any) => {
        const followObj = followDoc.toObject ? followDoc.toObject() : followDoc;
        return {
            ...followObj.follower,
            isFollowing: authedUserFollowing.some((follower: any) => compareObjectIds(follower.user, followObj.follower._id))
        };
    });

    return res.status(200).json({ data: followers, hasMore });
};

/**
 * Gets the user's followers list with details if allowed by privacy.
 * @route /user/profile/following/:id?page=N
 * @method GET
 * @requireAuth true
 * @return all following as UserPreview[]
 */
export const getFollowingById = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { id: requestedUserId } = req.params;

    const requestedProfile = await fetchProfileWithPrivacy(user, requestedUserId);
    const { isVisible } = requestedProfile;
    if (!isVisible) throw new StatusError('You are not authorized to view this profile.', 403);

    const getData = async (lowerBound: number, pageSize: number) => {
        return await FollowerModel.find({ follower: requestedUserId })
            .skip(lowerBound)
            .limit(pageSize)
            .select('-_id user')
            .populate('user', USER_PREVIEW_FIELDS)
            .lean();
    };

    const { data, hasMore } = await paginatedFetchAsync(req.query, USER_PAGE_SIZE, getData);

    // Check if user is following each user in the list
    const followingListIds = data.map((follower: any) => follower.user._id);
    const authedUserFollowing = await FollowerModel.find({ follower: user._id, user: { $in: followingListIds } }).lean();

    const following = data.map((followDoc: any) => {
        const followObj = followDoc.toObject ? followDoc.toObject() : followDoc;
        return {
            ...followObj.user,
            isFollowing: authedUserFollowing.some((following: any) => compareObjectIds(following.user, followObj.user._id))
        };
    });

    return res.status(200).json({ data: following, hasMore });
};

/**
 * Gets the user's liked places.
 * @route /user/profile/liked-places/:id?page=N
 * @method GET
 * @requireAuth true
 * @return all places that the requested user has liked
 */
export const getLikedPlacesById = async (req: Request, res: Response) => {
    const { id: requestedUserId } = req.params;

    const getData = async (lowerBound: number, pageSize: number) => {
        return await PlaceInterestModel.find({ user: requestedUserId })
            .select('place -_id')
            .populate({
                path: 'place',
                select: PLACES_DISPLAY_FIELDS,
                populate: { path: 'gathering_count' }
            })
            .skip(lowerBound)
            .limit(pageSize)
            .lean();
    };

    const { data, hasMore } = await paginatedFetchAsync(req.query, PLACE_PAGE_SIZE, getData);

    const likedPlaces = data.map((place: any) => place.place);
    const placesWithPhotos = await addPhotosToPlaces(likedPlaces);

    return res.status(200).json({ data: placesWithPhotos, hasMore });
};

/**
 * Follows the requested user if permitted by privacy else sends a follow request.
 * @route /user/follow/:idToFollow
 * @method POST
 * @requireAuth true
 * @return updatedUser: IUser
 */
export const followUser = async (req: Request, res: Response) => {
    const { user } = validateBodyFields(req.body, ['user']);
    const { idToFollow } = req.params;

    if (compareObjectIds(idToFollow, user._id)) throw new StatusError('You cannot follow yourself.', 400);

    const userToFollow = await fetchDocument(idToFollow, UserModel, 'blocked_users');
    await user.populate('blocked_users');

    // Delete follow request notification for userToFollow
    await NotificationModel.deleteMany({ user: userToFollow._id, user_from: user._id, type: NotificationType.FollowReq }).lean();

    // Check if user is blocked
    const blockedUser = userToFollow.blocked_users.find((blockedUser: any) => compareObjectIds(blockedUser.user_blocked, user._id));
    if (blockedUser) throw new StatusError('You cannot follow this user since they have blocked you.', 403);

    // Check if user is trying to follow someone they have blocked
    const blockedUserToFollow = user.blocked_users.find((blockedUser: any) => compareObjectIds(blockedUser.user_blocked, userToFollow._id));
    if (blockedUserToFollow) throw new StatusError('You must unblock this user before following them.', 403);

    const existingFollower = await FollowerModel.findOne({ user: idToFollow, follower: user._id }).lean();
    if (existingFollower) throw new StatusError('You are already following this user.', 400);

    // Check if userToFollow is private
    if (!userToFollow.is_public) {
        // Create follow request notification
        await createFollowRequestNotification(user, userToFollow);

        const userWithPrivacy = await fetchProfileWithPrivacy(user, userToFollow._id);
        return res.status(200).json(userWithPrivacy);
    }

    // User is public --> Create follow document
    await FollowerModel.create({ user: userToFollow._id, follower: user._id });

    // Create notification for userToFollow
    await createFollowNotification(user, userToFollow);

    const userWithPrivacy = await fetchProfileWithPrivacy(user, userToFollow._id);
    return res.status(200).json(userWithPrivacy);
};

/**
 * Cancels the follow request to the requested user. Only the user who sent the request can cancel it.
 *
 * @route /user/cancel-follow-request/:userIdToCancel
 * @method POST
 * @requireAuth true
 * @return updated unfollowed user object
 */
export const cancelFollowRequest = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { userIdToCancel } = req.params;

    const userToCancel = await fetchDocument(userIdToCancel, UserModel);
    await NotificationModel.deleteMany({ user: userToCancel._id, user_from: user._id, type: NotificationType.FollowReq }).lean();

    const userWithPrivacy = await fetchProfileWithPrivacy(user, userToCancel._id);
    return res.status(200).json(userWithPrivacy);
};

/**
 * Unfollows the requested user.
 * @route /user/unfollow/:idToUnfollow
 * @method POST
 * @requireAuth true
 * @return updated unfollowed user object
 */
export const unfollowUser = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const { idToUnfollow } = req.params;
    if (compareObjectIds(idToUnfollow, user._id)) throw new StatusError('You cannot unfollow yourself.', 400);

    const userToUnfollow = await fetchDocument(idToUnfollow, UserModel);
    await Promise.all([
        FollowerModel.deleteMany({ user: userToUnfollow._id, follower: user._id }).lean(), // Delete follow document
        NotificationModel.deleteMany({
            user: userToUnfollow._id,
            user_from: user._id,
            type: { $in: [NotificationType.Follow, NotificationType.FollowReq] }
        }).lean() // Delete all follow & followReq notifications
    ]);

    const userWithPrivacy = await fetchProfileWithPrivacy(user, userToUnfollow._id);
    return res.status(200).json(userWithPrivacy);
};

/**
 * Responds to a follow request.
 * @route /user/respond-to-follow-request/:notification_id
 * @method POST
 * @requireAuth true
 * @return { message: boolean }, "Success"
 */
export const respondToFollowRequest = async (req: Request, res: Response) => {
    const { user, accept }: { user: IUser; accept: boolean } = validateBodyFields(req.body, [
        'user',
        { field: 'accept', validator: validateBoolean }
    ]);
    const { notification_id } = req.params;
    const notification: INotification = await fetchDocument(notification_id, NotificationModel);
    if (!compareObjectIds(notification.user, user._id)) throw new StatusError('You are not authorized to respond to this request.', 403);
    if (notification.type !== NotificationType.FollowReq) throw new StatusError('This notification is not a follow request.', 400);

    const userFrom: IUser = await fetchDocument(notification.user_from, UserModel);

    const promises = [];
    if (accept) {
        // Check if user has already accepted the follow request
        const existingFollower: IFollower | null = await FollowerModel.findOne({ user: user._id, follower: userFrom._id }).lean();
        if (existingFollower) return res.status(200).json({ message: 'Success' });

        // Create follow document
        promises.push(FollowerModel.create({ user: user._id, follower: userFrom._id }));

        // Create notification for userToFollow
        promises.push(createFollowNotification(userFrom, user));
    }
    promises.push(NotificationModel.deleteMany({ user: user._id, user_from: userFrom._id, type: NotificationType.FollowReq }).lean());
    await Promise.all(promises);

    return res.status(200).json({ message: 'Success' });
};

/**
 * Gets the trending users paginated.
 * @route /user/trending?page=N
 * @method GET
 * @requireAuth true
 * @useCache true (30 minutes)
 * @return Paginated response of trending users as UserPreview[] sorted by trending_score descending.
 */
export const getTrendingUsers = async (req: Request, res: Response) => {
    const query = async (lowerBound: number, pageSize: number) => {
        return await UserModel.find()
            .sort({ trending_score: 'desc' })
            .skip(lowerBound)
            .limit(pageSize)
            .populate('follower_count')
            .select(USER_PREVIEW_FIELDS_WITH_FOLLOWERS)
            .lean();
    };
    const response = await paginatedFetchAsync(req.query, PLACE_PAGE_SIZE, query);
    return res.status(200).json({ data: response.data, hasMore: response.hasMore });
};

/**
 * Updates the user's interests.
 * @route /user/interests
 * @method PATCH
 * @requireAuth true
 * @return Updated user information
 */
export const updateUserInterests = async (req: Request, res: Response) => {
    const { user, newInterests } = validateBodyFields(req.body, ['user', 'newInterests']);

    const currentInterests = await getUserInterestsAsync(user._id);

    const interestsToRemove = currentInterests.filter((interest: String) => !newInterests.includes(interest));
    const interestsToAdd = newInterests.filter((interest: String) => !currentInterests.includes(interest));

    const removeIds = await getInterestDocumentIds(interestsToRemove);
    if (removeIds.length > 0) await UserInterestModel.deleteMany({ user: user._id, interest: { $in: removeIds } });

    const addIds = await getInterestDocumentIds(interestsToAdd);
    if (addIds.length > 0) await UserInterestModel.insertMany(addIds.map(interest => ({ user: user._id, interest })));

    const updatedUserInterests = await getUserInterestsAsync(user._id);
    return res.status(200).json(updatedUserInterests);
};

/**
 * Gets a user's owned borders.
 * @route /user/borders/:user_id
 * @method GET
 * @requireAuth true
 * @return UserBorder[]
 */
export const getUserBorders = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    let userBorders = await UserBorderModel.find({ user: user_id }).lean();
    return res.status(200).json(userBorders.map(userBorder => userBorder.border_owned));
};

/**
 * Upserts the auth'd user's details.
 * @route /user/details/upsert
 * @method POST
 * @requireAuth true
 * @return The updated user details.
 */
export const upsertUserDetails = async (req: Request, res: Response) => {
    const { user, updateFields } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'updateFields', validator: value => typeof value === 'object' && !validateArray(value) }
    ]);

    const userDetailsDocument: IUserDetails | null = await UserDetailsModel.findOne({ user: user._id });
    if (!userDetailsDocument) throw new StatusError('User details not found.', 400);

    for (const detail of Object.keys(updateFields)) {
        const value = updateFields[detail];
        if (!Object.values(Detail).includes(detail as Detail)) throw new StatusError(`Invalid detail: ${detail}`, 400);
        switch (detail) {
            case Detail.EDUCATION:
                if (!Object.values(EducationValues).includes(value as EducationValues)) throw new StatusError('Invalid education.', 400);
                break;

            case Detail.WORK:
                if (!validateString(value) || value.length > MAX_DETAIL_VALUE_LENGTH) throw new StatusError('Invalid work.', 400);
                break;

            case Detail.ALCOHOL:
            case Detail.SMOKE:
            case Detail.WEED:
                if (!Object.values(FrequencyValues).includes(value as FrequencyValues)) throw new StatusError('Invalid frequency.', 400);
                break;

            case Detail.FITNESS:
                if (!Object.values(FitnessValues).includes(value as FitnessValues)) throw new StatusError('Invalid fitness.', 400);
                break;

            case Detail.HEIGHT:
                if (!validateHeight(value)) throw new StatusError('Invalid height.', 400);
                break;

            case Detail.POLITICS:
                if (!Object.values(PoliticsValues).includes(value as PoliticsValues)) throw new StatusError('Invalid politics.', 400);
                break;

            case Detail.RELIGION:
                if (!Object.values(ReligionValues).includes(value as ReligionValues)) throw new StatusError('Invalid religion.', 400);
                break;

            case Detail.ZODIAC:
                if (!Object.values(ZodiacValues).includes(value as ZodiacValues)) throw new StatusError('Invalid zodiac.', 400);
                break;

            case Detail.NATIONALITY:
                if (!validateArray(value) || !validateNationalities(value)) throw new StatusError('Invalid nationalities.', 400);
                if ((value as string[]).length > MAX_NATIONALITY_COUNT)
                    throw new StatusError(`You can only select up to ${MAX_NATIONALITY_COUNT} nationalities.`, 400);

                updateFields[detail] = Array.from(new Set(value)).sort();

                break;
            default:
                throw new StatusError('Invalid detail.', 400);
        }

        userDetailsDocument[detail] = userDetailsDocument[detail] === value ? undefined : value;
    }

    // test
    await userDetailsDocument.save().catch(err => {
        consoleLogError(err);
        throw new StatusError('Update details failed.', 400);
    });

    return res.status(200).json({ ...userDetailsDocument.toObject(), age: getAge(user.date_of_birth), gender: user.gender });
};

/**
 * Create report for a user by the auth'ed user.
 * @route /user/report/:user_reported_id
 * @method POST
 * @requireAuth true
 * @return The newly created report
 */
export const reportUser = async (req: Request, res: Response) => {
    const {
        user: authed_user,
        reason,
        description
    } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'reason', validator: validateReportReason },
        { field: 'description', validator: validateReportDescription }
    ]);
    const { user_reported_id } = req.params;
    const user_reported = await fetchDocument(user_reported_id, UserModel);
    const report = await ReportModel.findOne({ user_from: authed_user._id, user_reported: user_reported._id });
    if (report) {
        // If the report already exists, update the reason and description
        report.reason = reason;
        report.description = description;
        await report.save();
    } else {
        // Otherwise, create a new report
        await ReportModel.create({
            user_from: authed_user._id,
            user_reported: user_reported._id,
            reason,
            description
        });
    }

    // Notify admins of the new report
    sendPushNotificationToAdmins('New report', `User ${authed_user.display_name} has reported user ${user_reported.display_name}.`, {
        picture_uri: user_reported.avatar_uri,
        profileId: user_reported._id,
        type: 'report'
    });

    return res.status(200).json(report);
};

/**
 * Blocks the given user.
 * @route /user/block/:user_to_block_id
 * @method POST
 * @requireAuth true
 * @return The blocked user
 */
export const blockUser = async (req: Request, res: Response) => {
    const { user: authed_user } = validateBodyFields(req.body, ['user']);
    const { user_to_block_id } = req.params;

    if (compareObjectIds(user_to_block_id, authed_user._id)) throw new StatusError('You cannot block yourself.', 400);
    const user_to_block = await fetchDocument(user_to_block_id, UserModel);

    // Check if user is already blocked
    const blockedUser = await BlockModel.findOne({ user: authed_user._id, user_blocked: user_to_block._id }).lean();
    if (!blockedUser) {
        const promises = [];

        // Delete all possible follows from user_to_block & authed_user
        promises.push(
            FollowerModel.deleteMany({
                $or: [
                    { user: authed_user._id, follower: user_to_block._id },
                    { user: user_to_block._id, follower: authed_user._id }
                ]
            })
        );

        // Delete all possible notifications between user_to_block & authed_user regardless of notification type
        promises.push(
            NotificationModel.deleteMany({
                $or: [
                    { user: authed_user._id, user_from: user_to_block._id },
                    { user: user_to_block._id, user_from: authed_user._id }
                ]
            })
        );

        // Delete all 1:1 non-gathering chats between user_to_block & authed_user (there should be at most 1)
        const convos: IConversation[] = await ConversationModel.find({
            users: { $all: [authed_user._id, user_to_block._id] },
            gathering: { $exists: false }
        }).lean();
        for (const convo of convos) {
            if (convo.users.length !== 2) continue; // Skip group chats
            promises.push(ConversationModel.findOneAndDelete({ _id: convo._id })); // MUST USE findOneAndDelete() to trigger middleware
        }

        // Create block document
        promises.push(BlockModel.create({ user: authed_user._id, user_blocked: user_to_block._id }));

        await Promise.all(promises);
    }

    const userWithPrivacy = await fetchProfileWithPrivacy(authed_user, user_to_block._id);
    return res.status(200).json(userWithPrivacy);
};

/**
 * Unblocks the given user.
 * @route /user/unblock/:user_to_unblock_id
 * @method POST
 * @requireAuth true
 * @return The unblocked user
 */
export const unblockUser = async (req: Request, res: Response) => {
    const { user: authed_user } = validateBodyFields(req.body, ['user']);
    const { user_to_unblock_id } = req.params;

    if (compareObjectIds(user_to_unblock_id, authed_user._id)) throw new StatusError('You cannot unblock yourself.', 400);
    const user_to_unblock = await fetchDocument(user_to_unblock_id, UserModel);

    // Check if user is already unblocked
    const blockedUser = await BlockModel.findOne({ user: authed_user._id, user_blocked: user_to_unblock._id }).lean();
    if (blockedUser) {
        // Delete block document
        await BlockModel.deleteOne({ user: authed_user._id, user_blocked: user_to_unblock._id });
    }

    const userWithPrivacy = await fetchProfileWithPrivacy(authed_user, user_to_unblock._id);
    return res.status(200).json(userWithPrivacy);
};

/**
 * Saves the user's push token to the database, overwriting the existing token if applicable.
 * @route /user/push-token
 * @method POST
 * @requireAuth true
 * @return "Push token saved."
 */
export const savePushToken = async (req: Request, res: Response) => {
    const { user, pushToken } = validateBodyFields(req.body, [
        // Required fields
        'user',
        { field: 'pushToken', validator: validatePushToken }
    ]);
    user.expo_push_token = pushToken;
    await user.save();
    return res.status(200).json('Push token saved.');
};

/**
 * Updates the user's settings.
 * @route /user/settings
 * @method PATCH
 * @requireAuth true
 * @return updated settings
 */
export const updateUserSettings = async (req: Request, res: Response) => {
    const { user, fields } = validateBodyFields(req.body, ['user', 'fields']);

    const userSettings: any = await UserSettingsModel.findOne({ user: user._id });
    if (!userSettings) throw new StatusError('User settings not found.', 400);

    let isDocumentModified = false;
    for (const field in fields) {
        if (!validateUserSettingField(field, fields[field])) throw new StatusError(`Invalid field: ${field}.`, 400);

        userSettings[field] = fields[field];
        if (!isDocumentModified) isDocumentModified = true;
    }

    if (isDocumentModified) await userSettings.save();

    return res.status(200).json(userSettings.toObject());
};

/**
 * Gets the user's settings.
 * @route /user/settings
 * @method GET
 * @requireAuth true
 * @return user's settings
 */
export const getUserSettings = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);

    const userSettings: any = await UserSettingsModel.findOne({ user: user._id }).lean();
    if (!userSettings) throw new StatusError('User settings not found.', 400);

    return res.status(200).json(userSettings);
};

/**
 * Gets the detailed views for a profile by profile ID paginated if the auth'ed user is premium.
 * @route /user/profile-views-details/:userId?page=N
 * @method GET
 * @requireAuth true
 * @requireSubscription true
 * @return The views for a profile by profile ID paginated.
 */
export const getProfileViewsDetails = async (req: Request, res: Response) => {
    const { userId } = req.params;

    await fetchDocument(userId, UserModel); // Make sure the profile exists

    const getData = async (lowerBound: number, pageSize: number) => {
        return await ViewModel.find({ profile: userId })
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
 * @route /user/pre-signed-url
 * @method GET
 * @requireAuth true
 * @return The pre-signed url and filename
 */
export const getUserPreSignedUrl = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);

    const filename = `${user._id}-${Date.now()}`;
    const url = await getUploadUrlAsync(filename, AWS_S3_PROFILE_PICTURES_BUCKET_NAME);

    return res.status(200).json({ url, filename });
};

/**
 * Saves the user's profile picture after uploading to S3 from a pre-signed url.
 * @route /user/pre-signed-url
 * @method POST
 * @requireAuth true
 * @return The updated user's profile picture url
 */
export const saveUserPfpFromPreSignedUrl = async (req: Request, res: Response) => {
    const { user, filename } = validateBodyFields(req.body, ['user', { field: 'filename', validator: validateString }]);

    // Delete old profile picture if it exists
    if (user.avatar_uri) {
        const oldFilename = getFilenameFromS3Url(user.avatar_uri);
        await deleteFileAsync(oldFilename, AWS_S3_PROFILE_PICTURES_BUCKET_NAME).catch(error => {
            consoleLogError(`Failed to delete old profile picture [${user.avatar_uri}]. ${error}`);
        });
    }

    // Save new profile picture
    user.avatar_uri = getS3Url(filename, AWS_S3_PROFILE_PICTURES_BUCKET_NAME);
    await user.save();

    return res.status(200).json(user.avatar_uri);
};

/**
 * Deletes the user from the database and handles all related documents.
 * @route /user/delete
 * @method DELETE
 * @requireAuth true
 * @return "User deleted."
 */
export const deleteAuthenticatedUser = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);

    // Handle all related documents
    await userDeletionHandler(user._id).catch(error => {
        consoleLogError(error);
        throw new StatusError(
            'Something went wrong trying to delete your account. Please try again. If this keeps happening, contact us at support@gathera.ca',
            400
        );
    });

    // Delete user
    await UserModel.deleteOne({ _id: user._id });

    return res.status(200).json('User deleted.');
};

/**
 * Adds a user feedback to the database.
 * @route /user/feedback
 * @method POST
 * @requireAuth true
 * @return "Feedback submitted."
 */
export const addUserFeedback = async (req: Request, res: Response) => {
    const { user, ratings, feedbackText } = validateBodyFields(req.body, [
        'user',
        { field: 'feedbackText', validator: validateFeedback },
        { field: 'ratings', validator: validateRatings }
    ]);

    await FeedbackModel.findOneAndUpdate(
        { user: user._id },
        { user: user._id, idea: ratings.idea, easeOfUse: ratings.easeOfUse, feedbackText },
        { upsert: true }
    );
    return res.status(200).json('Feedback submitted.');
};
