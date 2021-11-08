
import Matches from '../../models/Matches';
import { Request, Response } from 'express';
import { getCurrentWeek } from '../../../scrapper/api';

const getWeekMatches = async (weekId: number) => {
  try {
    const matches = await Matches.findOne( { weekId: { $eq: weekId } } );
    console.log(matches);
    if (matches && matches.matches) {
      return {matches: matches.matches};
    }
    return {matches: {}};
  } catch (error){
    console.error('Error getting matches per week',error);
    throw error;
  }
};

const getCurrentWeekId = async (req: Request, res: Response) => {
  try {
    console.log('get curretnt week Id');
    const currentWeek = await getCurrentWeek();
    return res.json({success:true, currentWeek: currentWeek.currentWeek});
  }
  catch( error ){
    console.error('Error GET currentWeek');
    console.error(error);
    return res.status(500).send(error);
  }
};

const postWeekMatches = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { matches, weekId } = req.body;
    const storeMatches = new Matches({
      matches,
      weekId
    });
    const savedMatches =  await storeMatches.save();
    console.log('Saved Matches', savedMatches);
    return res.json({success:true, matches: savedMatches});
  } catch (error) {
    console.error(' Error posting matches',error);
    throw error;
  }
};

export {
  getWeekMatches,
  getCurrentWeekId,
  postWeekMatches,
}