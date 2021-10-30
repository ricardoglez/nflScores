
const Matches = require('../models/Matches');
const { getCurrentWeek } = require('../../scrapper/api');

const getWeekMatches = async (req, res) => {
  const { weekId } = req.params;
  if(!weekId) {
    const err = new Error('error geting matches info weekId is required');
    console.log(err)
    throw err;
  }
  try {
    let matches = await Matches.findOne( { weekId: { $eq: weekId } } );
    if (matches && matches.matches) {
      return res.json({success:true, matches: matches.matches});    
    } 
    return res.json({success: true, matches: {}})
  } catch (error){
    console.error('Error getting matches per week',error);
    throw error;
  }
};

const getCurrentWeekMatches = async (req, res) => {
  try {
    let currentWeek = await getCurrentWeek(); 
    return res.json({success:true, matches: currentWeek});
  } 
  catch( error ){
    console.error('Error GET currentWeek');
    console.error(error);
    return reply.response(error).code(500);
  }
};

const postWeekMatches = async (req, res) => {
  try {
    const { matches, weekId } = req.body;
    const storeMatches = new Matches({
      matches,
      weekId
    });
    const savedMatches =  await storeMatches.save();
    console.log('Saved Matches',savedMatches);
    res.json({success:true, matches: savedMatches});
  } catch (error) {
    console.error(' Error posting matches',error);
    throw error;
  }
};

module.exports = {
  getWeekMatches,
  getCurrentWeekMatches,
  postWeekMatches,
}