import axios from "axios";

const baseURL: string = 'http://localhost:8080/api/v1';

const storeMatches = async( matchesData: any ): Promise<any> => {
  try {
    const data = await axios.post(`${baseURL}/matches/${matchesData.weekId}`, matchesData);
    return data;       
  } catch (error) {
    console.error('Error storing scores', error);
    throw error;
  }
}; 

const fetchMatches = (week: number): Promise<any> => {
  console.log('Fetch This Week :', week);
  return axios.get(`${baseURL}/matches/${week}`);
};

const getCurrentWeek = async (): Promise<any> => {
  console.log('Get Current Week');
  return axios.get(`${baseURL}/currentWeek`);
};

export {
 baseURL, storeMatches, fetchMatches, getCurrentWeek,
};