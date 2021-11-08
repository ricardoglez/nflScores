import express from 'express';
import {
  getCurrentWeekId,
  getWeekMatches,
  postWeekMatches
} from './api-v1-actions';

const router = express.Router();

router.get('/matches/:weekId', getWeekMatches);
router.get('/currentWeek', getCurrentWeekId);
router.post('/matches/:weekId', postWeekMatches);

export default router;