import { getDraftCapital, getTradeChart } from './database';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function main() {
  const draftCapital = await getDraftCapital();
  console.log("Fetched draft capital data:", draftCapital);
  const tradeChart = await getTradeChart();
  
  if (draftCapital.length === 0) {
    console.log("No draft capital data found.");
    rl.close();
    return;
  }

  console.log("Available teams:");
  draftCapital.forEach(team => console.log(team.team_name));

  rl.question('Select the first team: ', (team1Name) => {
    const team1 = draftCapital.find(team => team.team_name === team1Name);

    if (!team1) {
      console.log('Team not found');
      rl.close();
      return;
    }

    console.log(`${team1Name} draft capital:`, team1.picks);

    // remove first selected team from list of trade partners
    const availableTeamsForSecondSelection = draftCapital.filter(team => team.team_name !== team1Name);
    console.log("Available teams for the second selection:");
    availableTeamsForSecondSelection.forEach(team => console.log(team.team_name));

    rl.question('Choose the second team: ', (team2Name) => {
      const team2 = availableTeamsForSecondSelection.find(team => team.team_name === team2Name);

      if (!team2) {
        console.log('Team not found');
        rl.close();
        return;
      }

      console.log(`${team2Name} draft capital:`, team2.picks);

      let team1Picks: number[] = [];
      let team2Picks: number[] = [];

      const choosePicks = (teamName: string, picks: number[], callback: () => void) => {
        console.log(`${teamName} picks:`, picks);
        rl.question(`Choose a pick from ${teamName} (or type 'y' to finish): `, (pick) => {
          if (pick === 'y') {
            callback();
            return;
          }

          const pickNumber = parseInt(pick);
          if (!picks.includes(pickNumber)) {
            console.log('Invalid pick');
            choosePicks(teamName, picks, callback);
            return;
          }

          picks.splice(picks.indexOf(pickNumber), 1);
          if (teamName === team1Name) {
            team1Picks.push(pickNumber);
          } else {
            team2Picks.push(pickNumber);
          }

          choosePicks(teamName, picks, callback);
        });
      };

      const evaluateTrade = () => {
        const team1Value = team1Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
        const team2Value = team2Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
        const difference = Math.abs(team1Value - team2Value);

        console.log(`${team1Name} gives up:`, team1Picks, `worth ${team1Value}`);
        console.log(`${team2Name} gives up:`, team2Picks, `worth ${team2Value}`);
        
        if (difference <= 100) {
            console.log(`The trade between ${team1Name} and ${team2Name} is fair, and goes through.`);
            team1.picks = team1.picks.filter(pick => !team1Picks.includes(pick)).concat(team2Picks);
            team2.picks = team2.picks.filter(pick => !team2Picks.includes(pick)).concat(team1Picks);
            console.log(`${team1Name}'s new draft capital:`, team1.picks);
            console.log(`${team2Name}'s new draft capital:`, team2.picks);

        } else {
          if (team1Value > team2Value) {
            console.log(`${team2Name} needs to give up around ${difference} points of value`);
          } else {
            console.log(`${team1Name} needs to give up around ${difference} points of value`);
          }
        }
        rl.close();
      };

      choosePicks(team1Name, [...team1.picks], () => { choosePicks(team2Name, [...team2.picks], evaluateTrade);
      });
    });
  });
}

main();
