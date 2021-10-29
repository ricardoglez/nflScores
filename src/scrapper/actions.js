const inquirer = require('inquirer');
const { getCurrentWeek } = require('../scrapper');

const setYear = async () => {
  const answer = await inquirer.prompt(
    {
      type: "input",
      name:"currentYear",
      message:" Would you like to scrap this season scores (2021) y/n ", 
      filter(val) {
        if (!val) {
          return "y";
        }
        return val.toLowerCase();
      }
    }
  );
  return answer.currentYear;
  
};

const setCustomYear = async () => {
  const answer = await inquirer.prompt({
    type: "input",
    name: "customYear",
    message: "Select a Season",
    filter(val) {
      if ( !val || isNaN(val) ) {
       return 2021; 
      }
      return val;
    },
  });
  return answer.customYear;
};

const setWeek = async (season) => {
  const answer = await inquirer.prompt({
    type: "input",
    name: "week",
    message: `Select a week of the ${season} season `,
    async filter (val) {
      if (!val || isNaN(val)) {
        // If week is not provided use the current week
        const result = await getCurrentWeek();
        console.log(result);
        return result.currentWeek;
      } 
      return val;
    }
  });
  return answer.week;
}

const startPropmpts = async () => {
  try {
    const currentYear = await setYear();
    let season = "2021"; 
    let week = 1;
    if ( currentYear === "y" ) {
      week = await setWeek(season);
    } else if ( currentYear  === "n") {
      season = await setCustomYear();
      week = await setWeek(season);
    }
    return { week, season }
  } catch (error) {
    console.log('Error something unexpected happened', error);
  }
  
};

const main = async () => {
  const inputs = await startPropmpts()
  return inputs;
};

module.exports = {
  main
}
