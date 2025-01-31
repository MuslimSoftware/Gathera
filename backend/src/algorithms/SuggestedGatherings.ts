import { SubscriptionType } from '@lib/enums/user';
import { compareObjectIds } from '@/utils/validators/Validators';
import { MAX_NUM_SUGGESTED_GATHERINGS, UserSuggestedGatheringsModel } from '@/models/User/userSuggestedGatherings';
import { fetchDocument } from '@/utils/fetchDocument';
import { getDaysUntilEvent } from '@/utils/GatheringsHelper';
import { IGathering, GatheringModel } from '@/models/Place/gathering';
import { PlaceInterestModel } from '@/models/Place/placeInterest';
import { IUser, UserModel } from '@/models/User/user';
import { consoleLogError } from '@/utils/ConsoleLog';

const POINTS_FOR_SOON_EVENT_DATE = 1; // Max number of points to add to a gathering's score based on how soon the gathering is
const POINTS_IF_INTERESTED_IN_PLACE = 1;
const POINTS_PER_PREMIUM_USER_IN_GATHERING = 0.25;
const POINTS_PER_COMMON_INTEREST = 0.2;
const POINTS_PER_USER_IN_GATHERING = 0.1;
const POINTS_PER_FOLLOWER = 0.02;

/**
 * Gets the suggested gatherings for a user sorted descending by their suggested score.
 * @param user the user document to calculate suggested gatherings for
 * @note To be called by the suggested gatherings endpoint & cached for each user.
 */
export const SuggestedGatheringsAsync = async (user: IUser) => {
    // <----------------- INITIALIZATION SECTION ----------------->

    const gatheringScoreMap = new Map<string, number>(); // Maps gathering id to its trending score
    const authedUserInterestsSet = new Set<string>(); // Set of the authed user's interests

    // <--------------------- QUERIES SECTION -------------------->

    // all future gatherings that the user is not already in / requested & is not full
    const gatheringsPromise: Promise<IGathering[]> = GatheringModel.find({
        $or: [{ event_date: { $exists: true, $gte: new Date() } }, { event_date: { $exists: false } }], // Event date in future or no event date set
        user_list: { $ne: user._id }, // User is not already in the gathering
        requested_user_list: { $ne: user._id }, // User has not already requested to join the gathering
        $expr: { $lt: [{ $size: '$user_list' }, '$max_count'] }, // Gathering is not full
    }).populate({ path: 'user_list', populate: { path: 'interests follower_count' } });

    const placesUserIsInterestedInPromise = PlaceInterestModel.find({ user: user._id }).select('place').lean();
    const authedUserPromise = fetchDocument(user._id, UserModel, 'interests');

    // Await all promises
    const [gatherings, placesUserIsInterestedIn, authedUser] = await Promise.all([
        gatheringsPromise,
        placesUserIsInterestedInPromise,
        authedUserPromise,
    ]).catch((err) => {
        consoleLogError(err);
        throw new Error('Error fetching required documents for suggested gatherings algorithm.');
    });

    // Fill the authedUserInterestsSet with the authed user's interests
    for (const interest of (authedUser as any).interests) {
        authedUserInterestsSet.add(interest.interest);
    }

    // <------------------- CALCULATION SECTION ------------------>
    // For each gathering, determine its suggested score using weights

    for (const gathering of gatherings) {
        let score = 0;

        // Add points for each user in the gathering
        score += gathering.user_list.length * POINTS_PER_USER_IN_GATHERING;

        // Iterate through each user in the gathering
        for (const gatheringUser of gathering.user_list) {
            // Add points if the gathering user is a premium user
            score += (gatheringUser as any).subscription_type! === SubscriptionType.FREE ? 0 : POINTS_PER_PREMIUM_USER_IN_GATHERING;

            // Add points for each follower the gathering user has
            score += (gatheringUser as any).follower_count * POINTS_PER_FOLLOWER;

            // Add points for each common interest between the authed user & the gathering user
            for (const interest of (gatheringUser as any).interests)
                score += authedUserInterestsSet.has(interest.interest) ? POINTS_PER_COMMON_INTEREST : 0;
        }

        // Add points if the gathering is for a place the user is interested in
        score += placesUserIsInterestedIn.some((place) => compareObjectIds(place.place, gathering.place)) ? POINTS_IF_INTERESTED_IN_PLACE : 0;

        // Add points based on how soon the gathering is where the sooner the gathering is, the more points it gets up to a max of POINTS_FOR_SOON_EVENT_DATE
        if (gathering.event_date) score += getDecayedPointsForSoonEventDate(gathering.event_date);

        gatheringScoreMap.set(gathering._id.toString(), score); // Set the gathering's score in the map
    }

    // <--------------------- UPDATE SECTION --------------------->
    // Update the list of suggested gatherings for each user in the database

    const gatheringsSortedDesc = [...gatheringScoreMap.entries()].sort((a, b) => b[1] - a[1]); // Sort the gatherings by their score in descending order
    const suggestedGatheringsIds = gatheringsSortedDesc.map((gathering) => gathering[0]).slice(0, MAX_NUM_SUGGESTED_GATHERINGS); // Get the gathering ids from the sorted gatherings

    await UserSuggestedGatheringsModel.updateOne({ user: user._id }, { suggested_gatherings: suggestedGatheringsIds }, { upsert: true }).catch(
        (error) => {
            consoleLogError(error);
            throw new Error('Error updating user suggested gatherings.');
        }
    ); // Update the user's suggested gatherings in the database
};

/**
 * Gets the number of points to add to a gathering's score based on how soon the gathering is.
 * If the gathering is passed or more than a week away, 0 points are added.
 * @note The decay function is y = -1.9334^{x} + 101 where x is the number of days until the gathering.
 * @note The sooner the gathering is, the more points it gets up to a max of POINTS_FOR_SOON_EVENT_DATE.
 * @param gatheringEventDate The event date of the gathering.
 * @returns The number of points to add to the gathering's score.
 */
const getDecayedPointsForSoonEventDate = (gatheringEventDate: Date) => {
    const numDaysUntilGathering = getDaysUntilEvent(gatheringEventDate);
    if (numDaysUntilGathering <= 0 || numDaysUntilGathering > 7) return 0; // Gathering is passed or more than a week away

    // Score Decay Function: y = -1.9334^{x} + 101
    // Range: [0, 100] for x in [0, 7]
    const decay = -Math.pow(1.9334, numDaysUntilGathering) + 101;
    const multiplier = decay / 100; // Multiplier to scale the score by
    return multiplier * POINTS_FOR_SOON_EVENT_DATE;
};
