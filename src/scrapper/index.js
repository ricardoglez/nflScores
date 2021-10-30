#!/usr/bin/env node

const chalk = require("chalk");
const { fetchScores, extractScoresAndWinners } = require('./api');
const { main } = require("./actions");
const { fetchMatches, storeMatches } = require('../API');
const log = console.log;
const title = chalk.white.bgGreen; 

const matchWrapper = '.in-progress-table.section tbody';

const init = async () => {
  log(title("nfl socre scrapper"));
  log(chalk.green("Usage: This tool scraps the scores of previous weeks in the NFL"));
  try {
    const inputData = await main();
    const weekMatchesResult = await fetchMatches(inputData.week);
    const matches = weekMatchesResult.data.matches;
    console.log(Object.keys(matches).length);

    if (Object.keys(matches).length > 0) {
        log( chalk.blue(`${Object.keys(matches).length} matches has been found in db!`));  
        return {success: true, data: weekMatchesResult};
    } else {
      const $ = await fetchScores(inputData);
      const matchesElements = $(matchWrapper);

      log( chalk.blue(`Scrapper found ${matchesElements.length} matches!`));  
      const scoresAndWinnersResult = await extractScoresAndWinners(matchesElements, inputData.week, $);
      log(chalk.green('Extracted match details'));
      const storeData = { matches: scoresAndWinnersResult.matches, weekId: scoresAndWinnersResult.weekId };
      console.log(storeData);
      const storeDataResult = await storeMatches(storeData);
      console.log(storeDataResult.data);
      log(chalk.green('Matches Stored correctly!!'));
      return;
    }
  } catch (error){
    console.error(chalk.red(error));  
    throw error;
  }
};

const run = async () => {
  await init();
};

run();