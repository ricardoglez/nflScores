#!/usr/bin/env node

const chalk = require("chalk");
const { fetchScores, extractScoresAndWinners } = require('./api');
const { main } = require("./actions");
const log = console.log;
const title = chalk.white.bgGreen; 

const matchWrapper = '.in-progress-table.section tbody';

const init = async () => {
  log(title("nfl socre scrapper"));
  log(chalk.green("Usage: This tool scraps the scores of previous weeks in the NFL"));
  const inputData = await main();
  const $ = await fetchScores(inputData);

  const matchesList = $( matchWrapper ); 
    log( chalk.blue(`${matchesList.length} matches has been found!`));
    extractScoresAndWinners( matchesList, inputData.week, $ )
    .then( result => {
        log(chalk.green('Extracted Data Correctly!'));
        const storeData = { matches: result.data, weekId: result.data[0].weekId };
        // API.storeScores( storeData )
        //  .then( response => {
        //      console.log( response );
        //  })
        //  .catch(error => {
        //      console.error( error );
        // })
    })
    .catch(error => {
      console.log(error);
        console.error(chalk.red(error.message));
    });
  
};

const run = async () => {
  await init();
};

run();