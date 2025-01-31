import { requireSubscription } from './../middleware/requireSubscription';
import express from 'express';
import {
    getPlaces,
    getPlacePhotos,
    getInterestedUsers,
    toggleInterest,
    getTrendingPlaces,
    getPlace,
    getPlaceViewsDetails,
} from '@controllers/placeController';
import { defaultCache, useCache } from '@middleware/useCache';
import { FIVE_MINUTES_MS, THIRTY_MINUTES_MS } from '@utils/validators/Validators';

const router = express.Router();

// CACHED ROUTES
router.get('/', useCache(FIVE_MINUTES_MS), getPlaces);
router.get('/trending', useCache(THIRTY_MINUTES_MS), getTrendingPlaces);
router.get('/photos/:place_id', defaultCache, getPlacePhotos);

// NON-CACHED ROUTES
router.get('/get/:place_id', getPlace);
router.get('/views-details/:placeId', requireSubscription, getPlaceViewsDetails); // Requires subscription
router.get('/interested-users/:place_id', getInterestedUsers);
router.post('/toggle-interest/:place_id', toggleInterest);

export default router;
