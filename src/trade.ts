interface DraftCapital {
  team_name: string;
  picks: number[];
}

async function fetchTradeChart() {
  const response = await fetch('/api/tradeChart');
  if (!response.ok) {
    throw new Error('Failed to fetch trade chart');
  }
  return response.json();
}

export async function trade(
  team1: DraftCapital,
  team2: DraftCapital,
  team1Picks: number[],
  team2Picks: number[]
) {
  const tradeChart = await fetchTradeChart();

  const team1Value = team1Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
  const team2Value = team2Picks.reduce((acc, pick) => acc + tradeChart[pick], 0);
  const difference = Math.abs(team1Value - team2Value);

  if (difference <= 100) {
    team1.picks = team1.picks.filter(pick => !team1Picks.includes(pick)).concat(team2Picks).sort((a, b) => a - b);
    team2.picks = team2.picks.filter(pick => !team2Picks.includes(pick)).concat(team1Picks).sort((a, b) => a - b);

    return {
      success: true,
      message: `The trade between ${team1.team_name} and ${team2.team_name} is fair and goes through.`,
      updatedTeams: [team1, team2]
    };
  } else {
    const neededValue =
      team1Value > team2Value
        ? `${team2.team_name} needs to give up around ${difference} points of value.`
        : `${team1.team_name} needs to give up around ${difference} points of value.`;

    return {
      success: false,
      message: `The trade is denied. ${neededValue}`,
      updatedTeams: []
    };
  }
}
