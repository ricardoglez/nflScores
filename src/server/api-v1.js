const express = require('express');
const {
  getCurrentWeekMatches, 
  getWeekMatches,
  postWeekMatches
} = require('./api-v1-actions.js');
const router = express.Router();

router.use(express.json());
router.get('/matches/:weekId', getWeekMatches);
router.get('/currentWeek/', getCurrentWeekMatches);
router.post('/matches/:weekId', postWeekMatches);

module.exports = router;