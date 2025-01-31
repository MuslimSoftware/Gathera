import { useCache } from '@middleware/useCache';
import express from 'express';
import {
    getAllUserProfiles,
    getProfileById,
    updateAuthenticatedUser,
    followUser,
    getAuthenticatedUser,
    getFollowersById,
    getFollowingById,
    unfollowUser,
    respondToFollowRequest,
    getTrendingUsers,
    reportUser,
    blockUser,
    unblockUser,
    savePushToken,
    updateUserInterests,
    upsertUserDetails,
    getUserSettings,
    updateUserSettings,
    cancelFollowRequest,
    getUserBorders,
    getLikedPlacesById,
    getProfileViewsDetails,
    getUserPreSignedUrl,
    saveUserPfpFromPreSignedUrl,
    deleteAuthenticatedUser,
    addUserFeedback,
} from '@controllers/userController';
import { requireSubscription } from '@middleware/requireSubscription';
import { THIRTY_MINUTES_MS } from '@/utils/validators/Validators';

const router = express.Router();

// CACHED ROUTES
router.get('/trending', useCache(THIRTY_MINUTES_MS), getTrendingUsers);

// NON-CACHED ROUTES

router.get('/', getAuthenticatedUser);
router.delete('/delete', deleteAuthenticatedUser);
router.get('/all-users', getAllUserProfiles);
router.patch('/profile/update', updateAuthenticatedUser);

router.get('/profile/get/:id', getProfileById);
router.get('/profile/followers/:id', getFollowersById);
router.get('/profile/following/:id', getFollowingById);
router.get('/profile/liked-places/:id', getLikedPlacesById);

router.post('/follow/:idToFollow', followUser);
router.post('/unfollow/:idToUnfollow', unfollowUser);
router.post('/respond-to-follow-request/:notification_id', respondToFollowRequest);
router.post('/cancel-follow-request/:userIdToCancel', cancelFollowRequest);

router.patch('/interests', updateUserInterests);
router.post('/details/upsert', upsertUserDetails);
router.get('/borders/:user_id', getUserBorders);

router.post('/report/:user_reported_id', reportUser);
router.post('/block/:user_to_block_id', blockUser);
router.post('/unblock/:user_to_unblock_id', unblockUser);

router.get('/settings', getUserSettings);
router.patch('/settings', updateUserSettings);

router.post('/push-token', savePushToken);

router.get('/pre-signed-url', getUserPreSignedUrl);
router.post('/pre-signed-url', saveUserPfpFromPreSignedUrl);

router.get('/profile-views-details/:userId', requireSubscription, getProfileViewsDetails); // Requires subscription

router.post('/feedback', addUserFeedback);

export default router;
