import * as readline from 'readline';
import { getProspects, getDraftCapital } from './database';
import { trade } from './trade';
import { rl, askQuestion } from './readlineInterface';

async function draft() {
  let draftCapital = await getDraftCapital();
  let prospects: { name: string, position: string }[] = await getProspects();
  let numRounds: number = parseInt(await askQuestion('Enter the number of rounds (1-7): '));

  console.log(`You entered: ${numRounds}`);
  const totalPicks = 32 * numRounds;

  console.log('The 2025 NFL draft has begun!\n');
  for (let currPick = 1; currPick <= totalPicks; currPick++) {
    let team = draftCapital.find(team => team.picks.includes(currPick));

    if (!team) {
      console.log(`No team found for pick #${currPick}.`);
      continue;
    }

    let pickMade = false;

    while (!pickMade) {
      console.log(`${team.team_name} is on the clock with pick #${currPick}.\n`);

      console.log(`${team.team_name} Draft Choices:`);
      console.log('1. Make a Pick');
      console.log('2. Make a Trade');
      let choice: number = parseInt(await askQuestion('Enter your choice (1-2): '));

      switch (choice) {
        case 1: {
          console.log("You've chosen to make a pick.");
          console.log('The available prospects are: ');
          for (let i = 0; i < prospects.length; i++) {
            if (prospects[i]) {
              console.log(`${i + 1}: ${prospects[i].name} (${prospects[i].position})`);
            }
          }
          let prospectSelection: number = parseInt(
            await askQuestion('Select the number of the prospect: ')
          );

          if (prospectSelection > 0 && prospectSelection <= prospects.length) {
            console.log(`${team.team_name} has selected ${prospects[prospectSelection - 1]} at pick #${currPick}.\n`);
            prospects.splice(prospectSelection - 1, 1); // remove the selected prospect
            pickMade = true; 
          } else {
            console.log('Invalid selection. Please select a valid prospect number.');
          }
          break;
        }
        case 2:
          console.log("You've chosen to make a trade.");
          const tradeResult = await trade(draftCapital);
          if (tradeResult) {
            // update the current team to be the team that traded for the current pick
            team = draftCapital.find(t => t.team_name === tradeResult && t.picks.includes(currPick)) || team; 
          } else {
            console.log("Trade was not successful. Please make a pick or try another trade.");
          }
          break;
        default:
          console.log('Please select a valid option (1-2).\n');
          break;
      }
    }

    if (currPick % 32 == 0) {
      console.log(`Round ${Math.floor(currPick / 32)} of the 2025 NFL draft is now complete!`);
    }
  }

  console.log(`Your 2025 NFL mock draft is now complete!`);
  rl.close();
}

draft();
