import express from 'express';
import cors from 'cors';
import {
  getCurrentWeekId, 
  getWeekMatches,
  postWeekMatches
} from './api-v1-actions.js';

const router = express.Router();

router.use(express.json());
router.use(cors());
router.get('/matches/:weekId', getWeekMatches);
router.get('/currentWeek', getCurrentWeekId);
router.post('/matches/:weekId', postWeekMatches);

export default router;