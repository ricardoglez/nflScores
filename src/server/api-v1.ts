import express from 'express';

import {
  getCurrentWeekMatches, 
  getWeekMatches,
  postWeekMatches
} from './api-v1-actions.js';

const router = express.Router();

router.use(express.json());
router.get('/matches/:weekId', getWeekMatches);
router.get('/currentWeek/', getCurrentWeekMatches);
router.post('/matches/:weekId', postWeekMatches);

export default router;