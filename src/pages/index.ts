import { GetStaticProps } from 'next';
import { getCurrentWeek } from '../API';
import { getWeekMatches } from '../server/routes/api/api-v1-actions';
import Index from './index/index';


export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const result = await getCurrentWeek();
    const weekId = result.data.currentWeek;
    const weekMatches = await getWeekMatches(weekId);
    const model = {currentWeek: weekId, matches: weekMatches.matches};
    return { props: model };
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default Index;


