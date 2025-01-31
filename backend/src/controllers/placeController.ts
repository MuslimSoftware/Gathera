import { sanitizeUserInput } from '@utils/formatters/stringFormatting';
import { Request, Response } from 'express';
import { fetchDocument } from '@utils/fetchDocument';
import { USER_PREVIEW_FIELDS, USER_PREVIEW_FIELDS_WITH_FOLLOWERS_INTERESTS, fetchProfilesWithPrivacy } from '@utils/Profiles';
import { paginatedFetchAsync } from '@utils/Pagination';
import { PLACES_DISPLAY_FIELDS, addPhotosToPlace, addPhotosToPlaces } from '@utils/Places';
import { PLACE_PAGE_SIZE, PHOTO_PAGE_SIZE, USER_PAGE_SIZE, VIEW_PAGE_SIZE } from '@lib/constants/page-sizes';
import { ViewModel } from '@/models/view';
import { ViewType } from '@/gathera-lib/enums/user';
import { PlaceModel, IPlace } from '@/models/Place/place';
import { PlaceInterestModel } from '@/models/Place/placeInterest';
import { IUser } from '@/models/User/user';
import { PlacePhotoModel } from '@/models/Place/placePhoto';
import { validateBodyFields } from '@/utils/validators/Validators';

/**
 * Gets one place from the database by ID.
 * @route /place/get/:place_id
 * @method GET
 * @requireAuth true
 * @returns The requested place.
 */
export const getPlace = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const place = await fetchDocument(req.params.place_id, PlaceModel);
    const placeWithPhotosPromise = addPhotosToPlace(place);

    // Upsert view for place
    const viewPromise = ViewModel.findOneAndUpdate(
        { user: user._id, view_type: ViewType.PLACE, place: place._id },
        { updatedAt: new Date() },
        { upsert: true, new: true }
    );
    const [placeWithPhotos] = await Promise.all([placeWithPhotosPromise, viewPromise]);

    // Get view count
    const viewCount = await ViewModel.countDocuments({ place: place._id });

    // Get is interested
    const isInterested = await PlaceInterestModel.exists({ user: user._id, place: place._id });

    return res.status(200).json({ ...placeWithPhotos, view_count: viewCount, isInterested });
};

/**
 * Gets the detailed views for a place by place ID paginated if the auth'ed user is premium.
 * @route /place/views-details/:placeId?page=N
 * @method GET
 * @requireAuth true
 * @requireSubscription true
 * @return The views for a place by place ID paginated.
 */
export const getPlaceViewsDetails = async (req: Request, res: Response) => {
    const { placeId } = req.params;

    await fetchDocument(placeId, PlaceModel); // Make sure the place exists

    const getData = async (lowerBound: number, pageSize: number) => {
        return await ViewModel.find({ place: placeId })
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
 * Gets all places from the database.
 * TODO: Places by proximity
 * @route /place?query=X&page=N
 * @method GET
 * @requireAuth true
 * @return IPlace[]
 */
export const getPlaces = async (req: Request, res: Response) => {
    const { query, page } = req.query;
    const placeQuery = query ? { name: { $regex: sanitizeUserInput(query as string), $options: 'i' } } : {};

    if (!page) {
        // not a paginated request --> get all places, with limited information
        const allPlaces: IPlace[] = await PlaceModel.find(placeQuery).select(PLACES_DISPLAY_FIELDS).populate('gathering_count').lean();
        const placesWithPhotos = await addPhotosToPlaces(allPlaces);

        return res.status(200).json(placesWithPhotos);
    }

    const getData = async (lowerBound: number, pageSize: number) => {
        const places: IPlace[] = await PlaceModel.find(placeQuery)
            .select(PLACES_DISPLAY_FIELDS)
            .populate('gathering_count')
            .skip(lowerBound)
            .limit(pageSize)
            .lean();

        return places;
    };

    const { data: places, hasMore } = await paginatedFetchAsync(req.query, PLACE_PAGE_SIZE, getData);

    const placesWithPhotos = await addPhotosToPlaces(places);
    return res.status(200).json({ hasMore, data: placesWithPhotos });
};

/**
 * Gets Place photos for specific place_id.
 * @route /place/photos/:place_id?page=N
 * @method GET
 * @requireAuth true
 * @return The nth page of photos for the place.
 */
export const getPlacePhotos = async (req: Request, res: Response) => {
    const place = await fetchDocument(req.params.place_id, PlaceModel);

    const getData = async (lowerBound: number, pageSize: number) => {
        return await PlacePhotoModel.find({ google_place_id: place.google_place_id }).skip(lowerBound).limit(pageSize).lean();
    };

    const response = await paginatedFetchAsync(req.query, PHOTO_PAGE_SIZE, getData);

    return res.status(200).json(response);
};

/**
 * Gets all interested users for a place.
 * @route /place/interested-users/:place_id?page=N
 * @method GET
 * @requireAuth true
 * @return UserPreview[]
 */
export const getInterestedUsers = async (req: Request, res: Response) => {
    const { user: authed_user }: { user: IUser } = validateBodyFields(req.body, ['user']); // given by auth middleware
    const place = await fetchDocument(req.params.place_id, PlaceModel);

    // Get all interested users joined with user profile
    const getData = async (lowerBound: number, pageSize: number) => {
        return await PlaceInterestModel.find({ place: place._id })
            .skip(lowerBound)
            .limit(pageSize)
            .populate({
                path: 'user',
                select: USER_PREVIEW_FIELDS_WITH_FOLLOWERS_INTERESTS,
                populate: {
                    path: 'follower_count',
                },
            })
            .lean();
    };

    const { data, hasMore }: { data: any[]; hasMore: boolean } = await paginatedFetchAsync(req.query, USER_PAGE_SIZE, getData);

    const allUsersWithPrivacy = await fetchProfilesWithPrivacy(
        authed_user,
        data.map((interest) => interest.user as IUser)
    );
    const interestedUsers = allUsersWithPrivacy.map((user) => ({ ...user, place_id: place._id }));

    return res.status(200).json({ data: interestedUsers, hasMore });
};

/**
 * Toggles a user's interest in a place.
 * @route /place/toggle-interest/:place_id
 * @method POST
 * @requireAuth true
 * @return True if user is interested, false if not
 */
export const toggleInterest = async (req: Request, res: Response) => {
    const { user }: { user: IUser } = validateBodyFields(req.body, ['user']);
    const place = await fetchDocument(req.params.place_id, PlaceModel);

    const interest = await PlaceInterestModel.findOne({ user: user._id, place: place._id }).lean();
    let isUserInterested = false;
    if (!interest) {
        // Create new interest
        await new PlaceInterestModel({ user: user._id, place: place._id }).save();
        isUserInterested = true;
    } else {
        // Delete interest
        await PlaceInterestModel.deleteOne({ user: user._id, place: place._id });
    }

    return res.status(200).json(isUserInterested);
};

/**
 * Gets trending places paginated.
 * @route /place/trending?page=N
 * @method GET
 * @requireAuth true
 * @useCache true (30 minutes)
 * @return Paginated response of trending places as IPlace[] sorted by trending_score descending.
 */
export const getTrendingPlaces = async (req: Request, res: Response) => {
    const query = async (lowerBound: number, pageSize: number) => {
        return await PlaceModel.find<IPlace>().sort({ trending_score: 'desc' }).skip(lowerBound).limit(pageSize).populate('gathering_count').lean();
    };
    const response = await paginatedFetchAsync(req.query, PLACE_PAGE_SIZE, query);
    response.data = await addPhotosToPlaces(response.data as IPlace[]);
    return res.status(200).json(response);
};
