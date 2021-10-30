const axios = require('axios');

const baseURL = 'http://localhost:3000/api/v1';
const API = {
  baseURL,
  storeMatches: async ( matchesData ) => {
    try {
      const data = await axios.post(`${baseURL}/matches/${matchesData.weekId}`, matchesData);
      return data;       
    } catch (error) {
      console.error('Error storing scores', error);
      throw error;
    }
  },
  fetchMatches: (week) => {
    console.log('Fetch This Week :', week);
    return axios.get(`${baseURL}/matches/${week}`);
  },
  getCurrentWeek:( ) =>{
    console.log('Get CurrentWeek');
    return axios.get(`${baseURL}/currentWeek`);
  }

}

module.exports = API;