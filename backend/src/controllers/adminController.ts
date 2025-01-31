import { Request, Response } from 'express';
import StatusError from '@utils/StatusError';
import mongoose, { models } from 'mongoose';
import { sendBatchPushNotifications } from '@config/push.config';
import { UserBorderModel } from '@models/User/userBorder';
import { fetchDocument } from '@utils/fetchDocument';
import { validateArray, validateImageUrl, validateString } from '@lib/validators/Validators';
import { validateBorder } from '@lib/validators/UserValidators';
import { TrendingPlacesAsync } from '@/algorithms/TrendingPlaces';
import { TrendingUsersAsync } from '@/algorithms/TrendingUsers';
import { PlaceModel } from '@/models/Place/place';
import { InterestModel, IInterest } from '@/models/User/interest';
import { UserModel } from '@/models/User/user';
import { PlacePhotoModel } from '@/models/Place/placePhoto';
import { validateBodyFields } from '@/utils/validators/Validators';
import { PlaceSubType, PlaceType } from '@/gathera-lib/enums/place';
import { consoleLogError, consoleLogWarning } from '@/utils/ConsoleLog';
import { SuggestedGatheringsAsync } from '@/algorithms/SuggestedGatherings';

/**
 * Calls the TrendingUsers algorithm which calculates & stores trending_score
 * for all users in the database.
 * @route /admin/users/calculate-trending-score
 * @method POST
 * @requireAdmin true
 * @return 'User trending score calculation complete.'
 */
export const calculateUsersTrendingScore = async (_req: Request, res: Response) => {
    await TrendingUsersAsync().catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error calculating trending users.', 500);
    });
    res.status(200).json('User trending score calculation complete.');
};

/**
 * Calls the TrendingPlaces algorithm which calculates & stores trending_score
 * for all places in the database.
 * @route /admin/places/calculate-trending-score
 * @method POST
 * @requireAdmin true
 * @return 'Place trending score calculation complete.'
 */
export const calculatePlacesTrendingScore = async (_req: Request, res: Response) => {
    await TrendingPlacesAsync().catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error calculating trending places.', 500);
    });
    res.status(200).json('Place trending score calculation complete.');
};

/**
 * Calls the SuggestedGatherings algorithm which calculates & stores suggested
 * gatherings for all users in the database.
 * @route /admin/gatherings/calculate-suggested-gatherings
 * @method POST
 * @requireAdmin true
 * @return 'Suggested gatherings calculation complete.'
 */
export const calculateUsersSuggestedGatherings = async (_req: Request, res: Response) => {
    const allUsers = await UserModel.find().catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error fetching users.', 500);
    });

    const allPromises = [];

    for (const user of allUsers) {
        allPromises.push(
            SuggestedGatheringsAsync(user).catch((err) => {
                consoleLogError(err);
                throw new StatusError('Error calculating suggested gatherings.', 500);
            }),
        );
    }

    await Promise.all(allPromises);

    res.status(200).json('Suggested gatherings calculation complete.');
};

/**
 * Adds new places to the database
 * @route /admin/add-new-places
 * @method POST
 * @requireAdmin true
 * @return Number of places added
 */
export const addNewPlaces = async (req: Request, res: Response) => {
    const { places, type, subtype } = validateBodyFields(req.body, [
        // Required fields
        { field: 'places', validator: validateArray },
        { field: 'type', validator: (value) => Object.values(PlaceType).includes(value) },
        { field: 'subtype', validator: (value) => Object.values(PlaceSubType).includes(value) },
    ]);

    // Add places to database, if they don't already exist by google_place_id
    const existingPlacesDocuments = await PlaceModel.find({ google_place_id: { $in: places.map((place: any) => place.google_place_id) } }).catch(
        (err) => {
            consoleLogError(err);
            throw new StatusError('Error fetching existing places.', 500);
        },
    );

    const promises = [];
    const newPlaces = [];
    for (const place of places) {
        const { google_place_id } = place;
        place.type = type;
        place.subtype = subtype;

        let existingPlace = existingPlacesDocuments.find((existingPlace) => existingPlace.google_place_id === google_place_id);
        if (existingPlace) promises.push(PlaceModel.updateOne({ google_place_id }, place));
        else newPlaces.push(place);
    }
    promises.push(PlaceModel.insertMany(newPlaces));
    const operationResults = await Promise.all(promises).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error adding new places.', 500);
    });
    res.status(200).json(operationResults);
};

/**
 * Updates a field in all documents that match the query to a new value.
 * @route /admin/update-field
 * @method PATCH
 * @requireAdmin true
 * @return The update operation result.
 */
export const updateField = async (req: Request, res: Response) => {
    const {
        query = {},
        field,
        value,
        model,
    }: { query: any; field: string; value: any; model: string } = validateBodyFields(req.body, [
        // Required fields
        { field: 'field', validator: validateString },
        'value',
        { field: 'model', validator: validateString },
        // Optional fields
        { field: 'query', required: false },
    ]);

    const CollectionModel = models[model];
    if (!CollectionModel) throw new StatusError('Model not found.', 404);

    const updateOperation = await CollectionModel.updateMany(query, { [field]: value }).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error updating field.', 500);
    });

    res.status(200).json(updateOperation);
};

/**
 * Updates a field in all documents using manual logic for the value.
 * @route /admin/update-field-manual
 * @method PATCH
 * @requireAdmin true
 * @return The update operation result.
 */
export const updateFieldManual = async (req: Request, res: Response) => {
    const { model }: { model: string } = validateBodyFields(req.body, [
        // Required fields
        { field: 'model', validator: validateString },
    ]);

    const CollectionModel = models[model];
    if (!CollectionModel) throw new StatusError('Model not found.', 404);

    const allDocuments = await CollectionModel.find().catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error fetching documents.', 500);
    });

    let count = 0;
    for (const document of allDocuments) {
        // Manual logic here
        const { _id } = document;

        const visible_to = document.users;

        const updateOperation = await CollectionModel.updateOne({ _id }, { visible_to }).catch((err) => {
            consoleLogError(err);
            throw new StatusError('Error updating field.', 500);
        });
        if (updateOperation.acknowledged) count++;
    }

    res.status(200).json(`Updated ${count} documents.`);
};

/**
 * Updates all places' default_photo field to the first photo in the place's photo list.
 * @route /admin/update-place-photos
 * @method PATCH
 * @requireAdmin true
 * @return The update operation result.
 */
export const updatePlacesDefaultPhoto = async (_req: Request, res: Response) => {
    const placesDocuments = await PlaceModel.find().catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error fetching places.', 500);
    });

    // TODO: Update this to use bulkWrite() instead of Promise.all()
    // extremely inefficient to do this one by one
    const updateOperation = await Promise.all(
        placesDocuments.map(async (place) => {
            try {
                const { google_place_id } = place;

                const firstPlacePhoto = await PlacePhotoModel.findOne({ google_place_id });
                if (!firstPlacePhoto) return;

                console.log('Updating place: ', place.name);
                place.default_photo = firstPlacePhoto.url;
                await place.save();

                return 'SUCCESS';
            } catch {
                return `${place.name} FAILED`;
            }
        }),
    ).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error updating places.', 500);
    });

    res.status(200).json(updateOperation);
};

/**
 * Stores all the photos to the database.
 * @route /admin/store-place-photos
 * @method POST
 * @requireAdmin true
 * @return null
 */
export const storePlacePhotos = async (req: Request, res: Response) => {
    let { photo_objs } = validateBodyFields(req.body, [
        // Required fields
        { field: 'photo_objs', validator: validateArray },
    ]);

    // Assumes that all places are already in the database & the place_id is valid
    const photoDocuments = photo_objs.map((photo_obj: { google_place_id: string; url: string }) => {
        if (!validateImageUrl(photo_obj.url)) {
            throw new StatusError(`Invalid url: ${photo_obj.url}`, 400);
        }

        return new PlacePhotoModel({ google_place_id: photo_obj.google_place_id, url: photo_obj.url });
    });

    await PlacePhotoModel.insertMany(photoDocuments).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error storing place photos.', 500);
    });
    return res.status(200).json('Successfully added photos to the database!');
};

/**
 * Deletes places.
 * @route /admin/delete-places
 * @method DELETE
 * @requireAdmin true
 * @return { count: deletedCount }
 */
export const deletePlaces = async (_req: Request, res: Response) => {
    const condition: object = { _id: null }; // Remove all places that have these fields
    const removedPlacesCount = await PlaceModel.deleteMany(condition).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error deleting places.', 500);
    });

    return res.status(200).json({
        count: removedPlacesCount,
    });
};

/**
 * Sends a push notification to all users.
 * @route /admin/send-push-notification-to-all-users
 * @method POST
 * @requireAdmin true
 * @return A message indicating that the push notifications were sent successfully.
 */
export const sendPushNotificationToAllUsers = async (req: Request, res: Response) => {
    const { title, body, data } = validateBodyFields(req.body, [
        // Required fields
        { field: 'title', validator: validateString },
        { field: 'body', validator: validateString },
        // Optional fields
        { field: 'data', validator: (value) => typeof value === 'object', required: false },
    ]);
    const users = await UserModel.find()
        .lean()
        .catch((err) => {
            consoleLogError(err);
            throw new StatusError('Error fetching users.', 500);
        });
    const pushNotificationConfigs = users.map((user) => {
        return {
            user_id: user._id,
            token: user.expo_push_token,
            title,
            body,
            data,
        };
    });

    await sendBatchPushNotifications(pushNotificationConfigs).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error sending push notifications.', 500);
    });
    res.status(200).json({ message: 'Push notifications sent successfully.' });
};

/**
 * Endpoint that runs custom logic
 * @route /admin/script
 * @method POST
 * @requireAdmin true
 */
export const runScript = async (_req: Request, res: Response) => {
    res.status(200).json(true);
};

/**
 * Gives a border to a user.
 * @route /admin/borders/unlock/:user_id/:border
 * @method POST
 * @requireAuth true
 * @return The newly created user border
 */
export const giveUserBorder = async (req: Request, res: Response) => {
    const { user_id, border } = req.params;
    await fetchDocument(user_id, UserModel); // Validate user exists

    if (!validateBorder(border)) throw new StatusError('Invalid border.', 400);

    const existingUserBorder = await UserBorderModel.findOne({ user: user_id, border_owned: border }).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error fetching user border.', 500);
    });

    if (existingUserBorder) throw new StatusError('User already owns this border.', 400);

    const userBorder = await UserBorderModel.create({ user: user_id, border_owned: border }).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error creating user border.', 500);
    });

    return res.status(200).json(userBorder);
};

/**
 * Creates a new interest in the database.
 * @route /admin/interest/create/:interest_name
 * @method POST
 * @requireAdmin true
 * @return The newly created interest
 */
export const createInterest = async (req: Request, res: Response) => {
    const { name, icon, category } = req.params;

    const interest = await InterestModel.findOne({ name: name })
        .lean()
        .catch((err) => {
            consoleLogError(err);
            throw new StatusError('Error fetching interest.', 500);
        });

    if (interest) return res.status(200).json(interest);

    const interestCreated = await InterestModel.create({ name, icon, category }).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error creating interest.', 500);
    });

    return res.status(200).json(interestCreated);
};

/**
 * Creates interests in the database.
 * @route /admin/interest/create-many
 * @method POST
 * @requireAdmin false
 * @return The newly created interest
 */
export const createManyInterests = async (req: Request, res: Response) => {
    const { interests }: { interests: Array<IInterest> } = validateBodyFields(req.body, [
        // Required fields
        { field: 'interests', validator: validateArray },
    ]);

    const interestNames = interests.map((interest: IInterest) => interest.name);
    const existingInterests = await InterestModel.find({ name: { $in: interestNames } })
        .lean()
        .catch((err) => {
            consoleLogError(err);
            throw new StatusError('Error fetching interests.', 500);
        });

    let interestsFiltered = interests;
    if (existingInterests.length > 0) {
        // filter out interests that already exist
        interestsFiltered = interests.filter((interest: IInterest) => {
            return !existingInterests.find((interestExists) => interestExists.name === interest.name);
        });
    }

    const interestsSeen = new Set();
    const interestObjs: { name: string }[] = [];
    interestsFiltered.forEach((interest: IInterest) => {
        if (!interestsSeen.has(interest.name)) {
            interestsSeen.add(interest.name);
            interestObjs.push(interest);
        }
    });

    const interestsCreated = await InterestModel.create(interestObjs).catch((err) => {
        consoleLogError(err);
        throw new StatusError('Error creating interests.', 500);
    });

    return res.status(200).json(interestsCreated);
};

/**
 * Deletes a user.
 * @route /admin/user/delete/:user_id
 * @method DELETE
 * @requireAdmin true
 * @return "done"
 */
export const deleteUser = async (req: Request, res: Response) => {
    const { user_id } = req.params;
    await UserModel.findOneAndDelete({ _id: user_id }).catch((error) => {
        consoleLogError(error);
        throw new StatusError('Error deleting user.', 500);
    }); // MUST USE findOneAndDelete() TO TRIGGER MIDDLEWARE
    res.status(200).json('done');
};

/**
 * Searches all collections for a document that matches the given query in any field of the document (not just _id).
 * @route /admin/search/:query
 * @method GET
 * @requireAdmin true
 * @return The documents that has the given query in any field.
 */
export const searchDatabase = async (req: Request, res: Response) => {
    if (!req.params.query) throw new StatusError('Missing query', 400);

    const matchingDocuments: any[] = [];
    const MODEL_BLACKLIST = ['Place', 'PlacePhoto']; // The models to skip

    for (const modelName of mongoose.modelNames()) {
        if (MODEL_BLACKLIST.includes(modelName)) {
            consoleLogWarning(`Skipping ${modelName}...`);
            continue;
        }

        const Model = models[modelName];

        const allDocuments = await Model.find().catch((err) => {
            consoleLogError(err);
            throw new StatusError('Error fetching documents.', 500);
        });

        allDocuments.forEach((document) => {
            const documentFields = Object.keys(document.toJSON());
            documentFields.forEach((field) => {
                if (document[field] && document[field].toString().toLowerCase().includes(req.params.query.toLowerCase())) {
                    matchingDocuments.push({ collection: modelName, field, document });
                }
            });
        });
    }

    res.status(200).json(matchingDocuments);
};
