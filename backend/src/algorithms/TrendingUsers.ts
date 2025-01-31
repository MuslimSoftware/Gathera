import { ObjectId } from 'mongoose';
import { SubscriptionType, ViewType } from '@lib/enums/user';
import { SEVEN_DAYS_MS } from '@/utils/validators/Validators';
import { NotificationType } from '@/gathera-lib/enums/notification';
import { ViewModel } from '@/models/view';
import { consoleLogError, consoleLogSuccess } from '@/utils/ConsoleLog';
import { GatheringModel } from '@/models/Place/gathering';
import { FollowerModel } from '@/models/User/follower';
import { IUser, UserModel } from '@/models/User/user';
import { NotificationModel } from '@/models/notification';

/*
 * Users to exclude from the calculations
 */
const EXCLUDED_USERS = new Set<string>([
    '659336cb4d8ef4e307f1d31c', // Anthony
    '659337244d8ef4e307f1d378', // Younes
]);

const SUBSCRIPTION_MULTIPLIER = 1.5; // Multiplies the trending score by this number if the user is subscribed
const POINTS_IF_SUBSCRIBED = 1; // Points to add to the trending score if the user is subscribed
const POINTS_PER_GATHERING = 1; // Points to add to the trending score per gathering attending created in the last timeDelta
const POINTS_PER_INVITE_REC = 0.2; // Points to add to the trending score per invite received created in the last timeDelta
const POINTS_PER_FOLLOWER = 0.2; // Points to add to the trending score per follower created in the last timeDelta
const POINTS_PER_VIEW = 0.15; // Points to add to the trending score per view created in the last timeDelta

/**
 * Calculates and stores the trending_score for all users in the database for the last timeDelta.
 * @param timeDeltaMilis the time delta in milliseconds to look back for trending users.
 * @note To be called by a cron job / admin only.
 */
export const TrendingUsersAsync = async (timeDeltaMilis: number = SEVEN_DAYS_MS) => {
    // <----------------- INITIALIZATION SECTION ----------------->

    const TIME_DELTA = new Date(Date.now() - timeDeltaMilis);
    const userScoreMap = new Map<string, number>(); // Maps user id to their trending score

    // <--------------------- QUERIES SECTION -------------------->
    // For each type of event, get the number of events for each user
    const usersPromise: Promise<IUser[]> = UserModel.find().lean();

    // Users # of Gatherings: {_id: user_id, count: num_of_gatherings}[]
    const usersNumOfGatheringsPromise = GatheringModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA } } }, // Only look at gatherings created in the last timeDelta
        { $unwind: '$user_list' }, // Unwind the user_list to get a document for each user in the user_list for each gathering
        { $group: { _id: '$user_list', count: { $sum: 1 } } }, // Group by user and count the number of gatherings for each user
    ]);

    // Users # of Invites Received: {_id: user_id, count: num_of_invites}[]
    const usersNumOfInvitesPromise = NotificationModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA }, type: NotificationType.Invite } }, // Only look at invites created in the last timeDelta
        { $group: { _id: '$user', count: { $sum: 1 } } }, // Group by user and count the number of invites for each user
    ]);

    // Users # of Views: {_id: user_id, count: num_of_views}[]
    const usersNumOfViewsPromise = ViewModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA }, view_type: ViewType.PROFILE } }, // Only look at profile views created in the last timeDelta
        { $group: { _id: '$profile', count: { $sum: 1 } } }, // Group by user and count the number of views for each user
    ]);

    // Users # of Followers: {_id: user_id, count: num_of_followers}[]
    const usersNumOfFollowersPromise = FollowerModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA } } }, // Only look at followers created in the last timeDelta
        { $group: { _id: '$user', count: { $sum: 1 } } }, // Group by place and count the number of interests for each place
    ]);

    // Wait for all promises to resolve
    const [users, usersNumOfGatherings, usersNumOfInvites, usersNumOfViews, usersNumOfFollowers] = await Promise.all([
        usersPromise,
        usersNumOfGatheringsPromise,
        usersNumOfInvitesPromise,
        usersNumOfViewsPromise,
        usersNumOfFollowersPromise,
    ]).catch((err) => {
        consoleLogError(err);
        throw new Error('Error fetching required documents for trending users algorithm.');
    });

    // <------------------- CALCULATION SECTION ------------------>
    // For each user, determine their trending score using weights

    usersNumOfGatherings.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = userScoreMap.get(_id.toString()) || 0;
        const gatheringScore = count * POINTS_PER_GATHERING;
        userScoreMap.set(_id.toString(), prevScore + gatheringScore);
    });

    usersNumOfInvites.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = userScoreMap.get(_id.toString()) || 0;
        const userScore = count * POINTS_PER_INVITE_REC;
        userScoreMap.set(_id.toString(), prevScore + userScore);
    });

    usersNumOfViews.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = userScoreMap.get(_id.toString()) || 0;
        const interestScore = count * POINTS_PER_VIEW;
        userScoreMap.set(_id.toString(), prevScore + interestScore);
    });

    usersNumOfFollowers.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = userScoreMap.get(_id.toString()) || 0;
        const viewScore = count * POINTS_PER_FOLLOWER;
        userScoreMap.set(_id.toString(), prevScore + viewScore);
    });

    // Must be done after all other calculations
    users.forEach((user) => {
        const prevScore = userScoreMap.get(user._id.toString()) || 0;
        const subscribeScore = user.subscription === SubscriptionType.FREE ? 0 : POINTS_IF_SUBSCRIBED;
        const finalScore = SUBSCRIPTION_MULTIPLIER * (prevScore + subscribeScore);
        userScoreMap.set(user._id.toString(), finalScore);
    });

    // <--------------------- UPDATE SECTION --------------------->
    // Update the trending_score for each place in the database

    const updateOperations = [];
    for (const user of userScoreMap.entries()) {
        const [userId, trendingScore] = user;
        if (EXCLUDED_USERS.has(userId)) continue;

        updateOperations.push({
            updateOne: {
                filter: { _id: userId },
                update: { trending_score: trendingScore },
            },
        });
    }

    await UserModel.bulkWrite(updateOperations).catch((error) => {
        consoleLogError(error);
        throw new Error('Error updating users trending scores.');
    }); // Send the bulk write operation to the database
    consoleLogSuccess(`Updated ${userScoreMap.size} users' trending_score within time delta = ${timeDeltaMilis / 1000 / 60 / 60 / 24} days`);
};
