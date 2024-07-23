import { getTradeChart } from './database';
import { rl, askQuestion } from './readlineInterface';

interface DraftCapital {
  team_name: string;
  picks: number[];
}

export async function trade(draftCapital: DraftCapital[]): Promise<string | null> {
  const tradeChart = await getTradeChart();

  console.log("Available teams:");
  draftCapital.forEach(team => console.log(team.team_name));

  const team1Name = await askQuestion('Select the first team: ');
  const team1 = draftCapital.find(team => team.team_name === team1Name);
  if (!team1) {
    console.log('Team not found');
    return null;
  }
  console.log(`${team1Name} draft capital:`, team1.picks);

  // remove the first selected team from the list of trade partners
  const tradePartners = draftCapital.filter(team => team.team_name !== team1Name);
  console.log("Available trade partners:");
  tradePartners.forEach(team => console.log(team.team_name));

  const team2Name = await askQuestion('Choose the second team: ');
  const team2 = tradePartners.find(team => team.team_name === team2Name);
  if (!team2) {
    console.log('Team not found');
    return null;
  }
  console.log(`${team2Name} draft capital:`, team2.picks);

  let team1Picks: number[] = [];
  let team2Picks: number[] = [];

  const choosePicks = async (teamName: string, picks: number[]): Promise<number[]> => {
    let chosenPicks: number[] = [];
    while (true) {
      console.log(`${teamName} picks:`, picks);
      const pick = await askQuestion(`Choose a pick from ${teamName} (or type 'y' to finish): `);
      if (pick === 'y') break;

      const pickNumber = parseInt(pick);
      if (!picks.includes(pickNumber)) {
        console.log('Invalid pick');
        continue;
      }

      picks.splice(picks.indexOf(pickNumber), 1);
      chosenPicks.push(pickNumber);
    }
    return chosenPicks;
  };

  team1Picks = await choosePicks(team1Name, [...team1.picks]);
  team2Picks = await choosePicks(team2Name, [...team2.picks]);

  const team1Value = team1Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
  const team2Value = team2Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
  const difference = Math.abs(team1Value - team2Value);

  console.log(`${team1Name} gives up:`, team1Picks, `worth ${team1Value}`);
  console.log(`${team2Name} gives up:`, team2Picks, `worth ${team2Value}`);

  if (difference <= 100) {
    console.log(`The trade between ${team1Name} and ${team2Name} is fair, and goes through.`);
    team1.picks = team1.picks.filter(pick => !team1Picks.includes(pick)).concat(team2Picks).sort((a, b) => a - b);
    team2.picks = team2.picks.filter(pick => !team2Picks.includes(pick)).concat(team1Picks).sort((a, b) => a - b);
    console.log(`${team1Name}'s new draft capital:`, team1.picks);
    console.log(`${team2Name}'s new draft capital:`, team2.picks);
    return team2Name; // return the new team that holds the current pick
  } else {
    if (team1Value > team2Value) {
      console.log(`${team2Name} needs to give up around ${difference} points of value`);
    } else {
      console.log(`${team1Name} needs to give up around ${difference} points of value`);
    }
    return null;
  }
}
