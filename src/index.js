/**
 * Match Selector = css-11zx4lh
 * Teams Wrapper = css-1dbjc4n r-13awgt0 r-9aemit
 * Team Wrapper = css-1dbjc4n r-1awozwy r-18u37iz r-rxcuwo r-13qz1uu
 * Team Name = css-1dbjc4n r-1awozwy r-13awgt0 r-18u37iz r-1pi2tsx
 * Team Score = css-901oao r-1khnkhu r-1ujtvat r-1i10wst r-q4m81j r-icy1tk
 * Team Record = css-901oao r-zyhucb r-1fdbu1n r-1b43r93 r-1ff274t r-x5t2qn
 */
const { fetchScores } = require('./scrapper');
const { extractScoresAndWinners  } = require('./scrapper');
const cheerio = require('cheerio');
require('dotenv').config();

const matchWrapper = '.in-progress-table.section tbody';
const API = require('./API');
const week = 3;

const init = async () => {
    console.log('Initialize app...');
    const $ = await fetchScores(2019, week);
    const matchesList = $( matchWrapper ); 
    console.log(matchesList.length, 'matches has been found!');
    extractScoresAndWinners( matchesList, week )
    .then( result => {
        console.log('Extracted Data Correctly! ');
        let storeData = { matches: result.data, weekId: result.data[0].weekId };

        API.storeScores( storeData )
        .then( response => {
            console.log( response );
        })
        .catch(error => {
            console.error( error );
        })
    })
    .catch(error => {
        console.error(error);
    });
};

 init();