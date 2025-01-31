import express from 'express';
import {
    addNewPlaces,
    sendPushNotificationToAllUsers,
    updateField,
    updateFieldManual,
    updatePlacesDefaultPhoto,
    deletePlaces,
    storePlacePhotos,
    runScript,
    giveUserBorder,
    createInterest,
    createManyInterests,
    deleteUser,
    calculatePlacesTrendingScore,
    calculateUsersTrendingScore,
    searchDatabase,
    calculateUsersSuggestedGatherings,
} from '@controllers/adminController';

const router = express.Router();

router.get('/search/:query', searchDatabase);

router.post('/users/calculate-trending-score', calculateUsersTrendingScore);
router.post('/places/calculate-trending-score', calculatePlacesTrendingScore);
router.post('/gatherings/calculate-suggested-gatherings', calculateUsersSuggestedGatherings);

router.patch('/update-field', updateField);
router.patch('/update-field-manual', updateFieldManual);
router.patch('/update-place-photos', updatePlacesDefaultPhoto);
router.delete('/delete-places', deletePlaces);
router.post('/store-place-photos', storePlacePhotos);

router.post('/send-push-notification-to-all-users', sendPushNotificationToAllUsers);
router.post('/interest/create/:interest_name', createInterest);
router.post('/interest/create-many', createManyInterests);
router.post('/add-new-places', addNewPlaces);
router.post('/borders/unlock/:user_id/:border', giveUserBorder);

router.delete('/user/delete/:user_id', deleteUser);

router.post('/script', runScript);

export default router;
