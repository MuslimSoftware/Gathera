import express from 'express';
import {
    adminRoutes,
    authRoutes,
    conversationRoutes,
    gatheringRoutes,
    interestRoutes,
    notificationRoutes,
    placeRoutes,
    userRoutes,
    webhookRoutes,
} from './index';
import { asyncHandlingDFS } from '@middleware/asyncHandling';
import { requireAdmin } from '@middleware/requireAdmin';
import requireAuth from '@middleware/requireAuth';

const router = express.Router();

// PUBLIC ROUTES
router.use('/auth', authRoutes);
router.use('/interest', interestRoutes);
router.use('/webhook', webhookRoutes);

// AUTH ROUTES
router.use('/conversation', requireAuth, conversationRoutes);
router.use('/gathering', requireAuth, gatheringRoutes);
router.use('/notification', requireAuth, notificationRoutes);
router.use('/place', requireAuth, placeRoutes);
router.use('/user', requireAuth, userRoutes);

// ADMIN
router.use('/admin', requireAdmin, adminRoutes);

asyncHandlingDFS(router);
export default router;
