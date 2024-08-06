
async function fetchTradeChart() {
  const response = await fetch('/api/tradeChart');
  if (!response.ok) {
    throw new Error('Failed to fetch trade chart');
  }
  return response.json();
}

export interface DraftCapital {
  team_name: string;
  picks: number[];
}

export async function trade(
  allTeams: DraftCapital[],
  team1Name: string,
  team2Name: string,
  team1Picks: number[],
  team2Picks: number[]
) {
  const tradeChart = await fetchTradeChart();
  
  const team1 = allTeams.find(t => t.team_name === team1Name);
  const team2 = allTeams.find(t => t.team_name === team2Name);
  
  if (!team1 || !team2) {
    throw new Error('Invalid team selection');
  }

  const team1Value = team1Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
  const team2Value = team2Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
  const difference = Math.abs(team1Value - team2Value);

  if (difference <= 100) {
    const updatedTeams = allTeams.map(team => {
      if (team.team_name === team1Name) {
        return {
          ...team,
          picks: team.picks.filter(pick => !team1Picks.includes(pick)).concat(team2Picks).sort((a, b) => a - b)
        };
      }
      if (team.team_name === team2Name) {
        return {
          ...team,
          picks: team.picks.filter(pick => !team2Picks.includes(pick)).concat(team1Picks).sort((a, b) => a - b)
        };
      }
      return team;
    });

    return {
      success: true,
      message: `The trade between ${team1Name} and ${team2Name} is fair and goes through.`,
      updatedTeams
    };
  } else {
    const neededValue = team1Value > team2Value
      ? `${team2Name} needs to give up around ${difference} points of value.`
      : `${team1Name} needs to give up around ${difference} points of value.`;
    return {
      success: false,
      message: `The trade is denied. ${neededValue}`,
      updatedTeams: allTeams
    };
  }
}