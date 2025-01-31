import express from 'express';
import { login, logout, refresh, requestOTP, signup, userExists, validateOTP } from '@controllers/authController';
import { requireRefresh } from '@/middleware/requireAuth';

const router = express.Router();

// NON-PROTECTED ROUTES
router.post('/login', login);
router.post('/signup', signup);
router.post('/user-exists', userExists);
router.post('/request-otp', requestOTP);
router.post('/validate-otp', validateOTP);

// PROTECTED ROUTES
router.post('/refresh', requireRefresh, refresh);
router.post('/logout', requireRefresh, logout);

export default router;
