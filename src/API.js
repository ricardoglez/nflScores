const axios = require('axios');

const baseURL = 'http://localhost:4000/api/v1/';

const API = {
    storeScores: ( scoresData ) => {
        console.log('Storing Matches from Week ', scoresData.weekId)
        console.log(scoresData)
        return axios.post( baseURL+'matches', scoresData );        
    },
    fetchMatches: (week) => {
        console.log('Fetch This Week :' ,week)
        return axios.get(baseURL+'matches/'+week);
    },
    getCurrentWeek:( ) =>{
        return axios.get(baseURL+'currentWeek');
    }

}

module.exports = API;