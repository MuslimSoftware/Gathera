import { ObjectId } from 'mongoose';
import { consoleLogError, consoleLogSuccess } from '@/utils/ConsoleLog';
import { SEVEN_DAYS_MS } from '@/utils/validators/Validators';
import { ViewModel } from '@/models/view';
import { ViewType } from '@/gathera-lib/enums/user';
import { GatheringModel } from '@/models/Place/gathering';
import { IPlace, PlaceModel } from '@/models/Place/place';
import { PlaceInterestModel } from '@/models/Place/placeInterest';

const POINTS_PER_GATHERING = 1; // Points to add to the trending score per gathering created in the last timeDelta
const POINTS_PER_USER_IN_GATHERINGS = 0.75; // Points to add to the trending score per user in gatherings created in the last timeDelta
const POINTS_PER_INTEREST = 0.1; // Points to add to the trending score per interest created in the last timeDelta
const POINTS_PER_VIEW = 0.02; // Points to add to the trending score per view created in the last timeDelta

/**
 * Calculates and stores the trending_score for all places in the database for the last timeDelta.
 * @param timeDeltaMilis the time delta in milliseconds to look back for trending places.
 * @note To be called by a cron job / admin only.
 */
export const TrendingPlacesAsync = async (timeDeltaMilis: number = SEVEN_DAYS_MS) => {
    // <----------------- INITIALIZATION SECTION ----------------->

    const TIME_DELTA = new Date(Date.now() - timeDeltaMilis);
    const placeScoreMap = new Map<string, number>(); // Maps place id to its trending score

    // <--------------------- QUERIES SECTION -------------------->
    // For each type of event, get the number of events for each place

    const placesPromise: Promise<IPlace[]> = PlaceModel.find().lean();

    // Places # of Gatherings: {_id: place_id, count: num_of_gatherings}[]
    const placesNumOfGatheringsPromise = GatheringModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA } } }, // Only look at gatherings created in the last timeDelta
        { $group: { _id: '$place', count: { $sum: 1 } } }, // Group by place and count the number of gatherings for each place
    ]);

    // Places # of Users in Gatherings: {_id: place_id, count: num_of_users_in_gatherings}[]
    const placesNumOfUsersInGatheringsPromise = GatheringModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA } } }, // Only look at gatherings created in the last timeDelta
        { $unwind: '$user_list' }, // Unwind the user_list to get a document for each user in the user_list for each gathering
        { $group: { _id: '$place', count: { $sum: 1 } } }, // Group by place and count the number of users in gatherings for each place
    ]);

    // Places # of Interests: {_id: place_id, count: num_of_interested_users}[]
    const placesNumOfInterestsPromise = PlaceInterestModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA } } }, // Only look at interests created in the last timeDelta
        { $group: { _id: '$place', count: { $sum: 1 } } }, // Group by place and count the number of interests for each place
    ]);

    // Places # of Views: {_id: place_id, count: num_of_views}[]
    const placesNumOfViewsPromise = ViewModel.aggregate([
        { $match: { createdAt: { $gte: TIME_DELTA }, view_type: ViewType.PLACE } }, // Only look at place views created in the last timeDelta
        { $group: { _id: '$place', count: { $sum: 1 } } }, // Group by place and count the number of views for each place
    ]);

    // Wait for all promises to resolve
    const [placesNumOfGatherings, placesNumOfUsersInGatherings, placesNumOfInterests, placesNumOfViews, places] = await Promise.all([
        placesNumOfGatheringsPromise,
        placesNumOfUsersInGatheringsPromise,
        placesNumOfInterestsPromise,
        placesNumOfViewsPromise,
        placesPromise,
    ]).catch((err) => {
        consoleLogError(err);
        throw new Error('Error fetching required documents for trending places algorithm.');
    });

    // <------------------- CALCULATION SECTION ------------------>
    // For each place, determine its trending score using weights

    placesNumOfGatherings.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = placeScoreMap.get(_id.toString()) || 0;
        const gatheringScore = count * POINTS_PER_GATHERING;
        placeScoreMap.set(_id.toString(), prevScore + gatheringScore);
    });

    placesNumOfUsersInGatherings.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = placeScoreMap.get(_id.toString()) || 0;
        const userScore = count * POINTS_PER_USER_IN_GATHERINGS;
        placeScoreMap.set(_id.toString(), prevScore + userScore);
    });

    placesNumOfInterests.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = placeScoreMap.get(_id.toString()) || 0;
        const interestScore = count * POINTS_PER_INTEREST;
        placeScoreMap.set(_id.toString(), prevScore + interestScore);
    });

    placesNumOfViews.forEach(({ _id, count }: { _id: ObjectId; count: number }) => {
        const prevScore = placeScoreMap.get(_id.toString()) || 0;
        const viewScore = count * POINTS_PER_VIEW;
        placeScoreMap.set(_id.toString(), prevScore + viewScore);
    });

    // <--------------------- UPDATE SECTION --------------------->
    // Update the trending_score for each place in the database

    const updateOperations = [];
    for (const place of places) {
        const trendingScore = placeScoreMap.get(place._id.toString()) || 0;

        updateOperations.push({
            updateOne: {
                filter: { _id: place._id },
                update: { trending_score: trendingScore },
            },
        });
    }

    await PlaceModel.bulkWrite(updateOperations).catch((error) => {
        consoleLogError(error);
        throw new Error('Error updating places trending scores.');
    }); // Send the bulk write operation to the database
    consoleLogSuccess(`Updated ${placeScoreMap.size} places' trending_score within time delta = ${timeDeltaMilis / 1000 / 60 / 60 / 24} days`);
};
