const axios = require('axios');
const cheerio = require('cheerio');
const chalk = require('chalk');
const baseURL = 'https://www.cbssports.com/nfl/scoreboard';
//https://www.cbssports.com/nfl/scoreboard/all/2019/regular/1/

const log = console.log;
const fetchScores = async ( {season, week} ) => {
    week = week < 1 ? 1 : week;
    season = !season ? 2021 : season;
    log(chalk.green(`Fetch Scores in Week #${week}`));
    const requestURL = `${baseURL}/all/${season}/regular/${week}`;
    const scoresData = await axios.get( requestURL );
    return cheerio.load( scoresData.data );
};
const getCurrentWeek = async ()=> {
    try{
        let requestURL = `${baseURL}`;
        const scoresData = await axios.get( requestURL );
        let $ = cheerio.load( scoresData.data );
        let currentWeek = $('.ToggleContainer-button.is-active').text().match(/\d/)[0];
        console.log( currentWeek );
        return {success:true , currentWeek: currentWeek}
    }
    catch(error){
        return {success:false, error}
    }
};
const extractScoresAndWinners = ( matchesList, week, $ ) => {
  log(chalk.white.bgBlue( `Extracting scores and winners for week ${week}`));
    return new Promise ( (res, rej ) => {
        try{
            const matches = Object.keys(matchesList).reduce( (acc, matchKey, matchIdx) => {
              if ( isNaN(parseInt(matchKey)) ) {
              return acc;
            }
            const initialTeamVal = {
              name: null,
              score: 0,
              record: null,
              isWinner: false,
            };

            let teams = { 
                home:initialTeamVal, 
                away:initialTeamVal
            }
            const teamsElements = $(matchesList[matchKey]).find('tr');
            teams.home.name= $(teamsElements[0]).find('>td.team>a.team').text();
            teams.away.name= $(teamsElements[1]).find('>td.team>a.team').text();
    
            let scoresElements = $(matchesList[matchKey]).find('tr>td.total-score');
            teams.home.score = parseInt($(scoresElements[0]).text());
            teams.away.score = parseInt($(scoresElements[1]).text());
    
            if( $(teamsElements[0]).find('span.marker').length >= 1 ){
                teams.home.isWinner = true;
            }
            else if( $(teamsElements[1]).find('span.marker').length >= 1){
                teams.away.isWinner = true;
            }
            acc[matchIdx] =  { teams: teams, id: matchIdx, weekId: week }
            return acc;
            }, {});
            res( {success: true , data: matches } );
        }
        catch( error ){
          log(error);
            rej({ succes: false , error: error})
        }
        
    } );
    

};
module.exports = { fetchScores, baseURL, extractScoresAndWinners , getCurrentWeek }