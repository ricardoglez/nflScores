const axios = require('axios');

const baseURL = 'https://localhost:4000/api/v1/';

const API = {
    storeScores: ( scoresData ) => {
        console.log('Storing Matches from Week ', scoresData.weekId)
        console.log(scoresData)
        return axios.post( baseURL+'matches', scoresData );        
    }
}

module.exports = API;