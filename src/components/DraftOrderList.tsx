"use client";
import React, { useEffect, useState } from 'react';
import Team from './Team';

interface TeamProps {
  team_name: string;
  picks: number[];
}

interface DraftOrderListProps {
  rounds: number;
}

const DraftOrderList: React.FC<DraftOrderListProps> = ({ rounds }) => {
  const [draftOrder, setDraftOrder] = useState<TeamProps[]>([]);

  useEffect(() => {
    const fetchDraftOrder = async () => {
      try {
        const response = await fetch('/api/teams');
        const data: TeamProps[] = await response.json();
        setDraftOrder(data);
      } catch (error) {
        console.error('Failed to fetch draft order:', error);
      }
    };
    fetchDraftOrder();
  }, []);

  // Remove any picks beyond the selected number of rounds
  const numPicks = rounds * 32;
  const limitedDraftOrder = draftOrder.flatMap(team =>
    (team.picks || []).map(pick => ({
      team_name: team.team_name,
      pick,
    }))
  ).sort((a, b) => a.pick - b.pick).slice(0, numPicks);

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {limitedDraftOrder.map((team, index) => (
        <div key={index} className="border-b border-gray-300 p-2">
          <Team 
            pickNumber={team.pick} 
            teamName={team.team_name} 
            logoURL={`/images/${team.team_name}.png`} 
          />
        </div>
      ))}
    </div>
  );
};

export default DraftOrderList;
