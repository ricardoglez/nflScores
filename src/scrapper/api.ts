import axios from 'axios';
import cheerio from 'cheerio';
import chalk from 'chalk';
const baseURL: string = 'https://www.cbssports.com/nfl/scoreboard';
//https://www.cbssports.com/nfl/scoreboard/all/2019/regular/1/

const log = console.log;

interface TeamDetails {
  name: string,
  score: number,
  record: string,
  isWinner: boolean
}

type inputData = {
  week: number,
  season:number
}

const fetchScores = async ( params: inputData ) : Promise<any> => {
    const week = params.week < 1 ? 1 : params.week;
    const season = !params.season ? 2021 : params.season;
    log(chalk.green(`Fetch Scores in Week #${week}`));
    const requestURL = `${baseURL}/all/${season}/regular/${week}`;
    const scoresData = await axios.get( requestURL );
    return cheerio.load( scoresData.data );
};

const getCurrentWeek = async (): Promise<any> => {
    try{
        let requestURL = `${baseURL}`;
        const scoresData = await axios.get( requestURL );
        let $ = cheerio.load( scoresData.data );
        let currentWeek = $('.ToggleContainer-button.is-active').text().match(/\d/)[0];
        return { success:true , currentWeek }
    }
    catch(error){
        return {success:false, error}
    }
};

const extractScoresAndWinners = ( matchesList: Array<any>, week: number, $: any ): Promise<any> => {
  log(chalk.white.bgBlue( `Extracting scores and winners for week ${week}`));
    return new Promise ( (res, rej ) => {
        try{
            const matches = Object.keys(matchesList).reduce( (acc:any, matchKey: any, matchIdx:number)  => {
              if ( isNaN(parseInt(matchKey)) ) {
              return acc;
            }

            const initialTeamVal = (): TeamDetails => {
              return {
                name: '',
                score: 0,
                record: '',
                isWinner: false,
              }
            };

            let teams = { 
                home: initialTeamVal(), 
                away: initialTeamVal()
            };

            const teamsElements: Array<any> = $(matchesList[matchKey]).find('tr>td.team').toArray();
            
            teams.home.name = $(teamsElements[0]).find('a.team.helper-team-name').text();
            teams.away.name= $(teamsElements[1]).find('a.team.helper-team-name').text();
    
            let scoresElements: Array<any> = $(matchesList[matchKey]).find('tr>td.total-score').toArray();
            teams.home.score = parseInt($(scoresElements[0]).text());
            teams.away.score = parseInt($(scoresElements[1]).text());
            
            teams.home.record = $(teamsElements[0]).find('span.record').text();
            teams.away.record = $(teamsElements[1]).find('span.record').text();
            
            if( $(teamsElements[0]).find('span.marker').length >= 1 ){
                teams.home.isWinner = true;
            }
            else if( $(teamsElements[1]).find('span.marker').length >= 1){
                teams.away.isWinner = true;
            }
            acc[matchIdx] =  { teams: teams, id: matchIdx, weekId: week };
            return acc;
            }, {});
            return res( {success: true , matches, weekId: week } );
        }
        catch( error ){
          log(error);
            rej({ succes: false , error: error})
        }
        
    } );
    

};
export { fetchScores, baseURL, extractScoresAndWinners , getCurrentWeek }