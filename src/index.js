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
const yargs = require('yargs');

const options = yargs
 .usage("Usage: This tool scraps the scores of previous weeks in the NFL you can use -w <week> to select a week and -s to select the season")
 .option("w", { alias: "week", describe: "The week number that want to scrap ", type: "number"  })
 .option("s", { alias: "season", describe: "The season year that want to scrap ", type: "number" })
 .argv;

 const arguments = yargs.parse();

 console.log('Arguments :', arguments );

const matchWrapper = '.in-progress-table.section tbody';
const {API} = require('./API');
let week = arguments.hasOwnProperty('week') ? arguments.week : 1;
let season = arguments.hasOwnProperty('season') ? arguments.season : 2019;
week = week > 17 ? 17 : week;
season = season < 1970 ? 2019 : season;


const init = async () => {
    console.log('Initialize app...');
    const $ = await fetchScores(season, week);
    const matchesList = $( matchWrapper ); 
    console.log(matchesList.length, 'matches has been found!');
    extractScoresAndWinners( matchesList, week )
    .then( result => {
        console.log('Extracted Data Correctly! ', result );
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
