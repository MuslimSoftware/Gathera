import express from 'express';
import {
    createGathering,
    deleteGathering,
    getGatherings,
    updateGathering,
    getAllFutureGatheringsByPlaceId,
    getFullGatheringById,
    removeUserFromGathering,
    joinGathering,
    respondToGatheringInvite,
    inviteUserToGathering,
    respondToJoinRequest,
    getGatheringsByUserId,
    getSuggestedGatherings,
    getInvitedUsers,
    getGatheringViewsDetails,
    getGatheringPreSignedUrl,
    saveGatheringPictureFromPreSignedUrl,
} from '@controllers/gatheringController';
import { requireSubscription } from '@middleware/requireSubscription';
import { useCache } from '@middleware/useCache';
import { FIFTEEN_SECONDS_MS, ONE_MINUTE_MS } from '@utils/validators/Validators';

const router = express.Router();

// CACHED ROUTES
router.get('/', useCache(ONE_MINUTE_MS), getGatherings);
router.get('/place/:place_id', useCache(FIFTEEN_SECONDS_MS), getAllFutureGatheringsByPlaceId);

// NON-CACHED ROUTES
router.get('/user/:user_id', getGatheringsByUserId);
router.post('/create', createGathering);
router.get('/suggested', getSuggestedGatherings);
router.get('/get/:gathering_id', getFullGatheringById);
router.post('/join/:gathering_id', joinGathering);
router.post('/invite/:gathering_id', inviteUserToGathering);
router.get('/invited-users/:gathering_id', getInvitedUsers);
router.post('/respond-invite/:notification_id', respondToGatheringInvite);
router.post('/respond-to-request/:gathering_id', respondToJoinRequest);
router.post('/remove-user/:gathering_id', removeUserFromGathering);
router.patch('/update/:gathering_id', updateGathering);
router.delete('/delete/:gathering_id', deleteGathering);

router.get('/pre-signed-url/:gathering_id', getGatheringPreSignedUrl);
router.post('/pre-signed-url/:gathering_id', saveGatheringPictureFromPreSignedUrl);

router.get('/views-details/:gathering_id', requireSubscription, getGatheringViewsDetails); // Requires subscription

export default router;
