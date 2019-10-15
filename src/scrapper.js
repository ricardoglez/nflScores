const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const baseURL = 'https://www.cbssports.com/nfl/scoreboard';
//https://www.cbssports.com/nfl/scoreboard/all/2019/regular/1/

const fetchScores = async ( year, week ) => {
    week = week < 1 ? 1 : week;
    year = !year ? 2019 : year;
    console.log('Fetch Scores in Week #', week);
    let requestURL = `${baseURL}/all/${year}/regular/${week}`;
    const scoresData = await axios.get( requestURL );
    return cheerio.load( scoresData.data );
}

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
}

const extractScoresAndWinners = ( matchesList, week ) => {
    return new Promise ( (res, rej ) => {
        try{
            const matches = { };
            let matchIdx = 0;
            Object.keys(matchesList).forEach( matchKey => {
                if(isNaN(parseInt(matchKey))){
                    return 
                }
                let teams = { 
                    home:{
                        name:null,
                        score:0,
                        record:null,
                        isWinner: false,
                    }, 
                    away:{
                        name:null,
                        score:0,
                        record:null,
                        isWinner: false,
                    }
                }
                let teamsElements = cheerio(matchesList[matchKey]).find('tr');
                teams.home.name= cheerio(teamsElements[0]).find('>td.team>a.team').text();
                teams.away.name= cheerio(teamsElements[1]).find('>td.team>a.team').text();
        
                let scoresElements = cheerio(matchesList[matchKey]).find('tr>td.total-score');
                teams.home.score = parseInt(cheerio(scoresElements[0]).text());
                teams.away.score = parseInt(cheerio(scoresElements[1]).text());
        
                if( cheerio(teamsElements[0]).find('span.marker').length >= 1 ){
                    teams.home.isWinner = true;
                }
                else if( cheerio(teamsElements[1]).find('span.marker').length >= 1){
                    teams.away.isWinner = true;
                }
                
        
                matches[matchIdx] =  { teams: teams, id: matchIdx, weekId: week }
                matchIdx ++;
            } )
            res( {success: true , data: matches } );
        }
        catch( error ){
            rej({ succes: false , error: error})
        }
        
    } );
    

};
module.exports = { fetchScores, baseURL, extractScoresAndWinners , getCurrentWeek }