import express from 'express';
import { getNotifications, deleteNotification, getUnreadNotificationCount } from '@controllers/notificationController';

const router = express.Router();

router.get('/', getNotifications);
router.get('/unread', getUnreadNotificationCount);
router.delete('/delete/:notification_id', deleteNotification);

export default router;
