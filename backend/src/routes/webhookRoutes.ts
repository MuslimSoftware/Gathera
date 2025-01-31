import express from 'express';
import { userSubscribed, userSubscriptionExpired } from '@/controllers/webhookController';
import { requireRevenueCatAuth } from '@/middleware/requireRevenueCatAuth';

const router = express.Router();

// RevenueCat webhook routes
router.post('/revenue-cat/subscribed', requireRevenueCatAuth, userSubscribed);
router.post('/revenue-cat/expired', requireRevenueCatAuth, userSubscriptionExpired);

export default router;
