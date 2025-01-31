import { defaultCache } from '@middleware/useCache';
import express from 'express';
import { getInterests } from '@controllers/interestController';

const router = express.Router();

// CACHED ROUTES
router.get('/', defaultCache, getInterests);

export default router;
