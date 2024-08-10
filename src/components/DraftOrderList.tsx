// DraftOrderList.tsx
import React from 'react';
import TeamInDraft from './TeamInDraft';
import { DraggableTeam } from './DraftOrderGrid';

interface DraftOrderListProps {
  draftCapital: DraggableTeam[];
  rounds: number;
  draftedPlayers: { [key: string]: string };
  currentPickIndex: number;
}

const DraftOrderList: React.FC<DraftOrderListProps> = ({ draftCapital, rounds, draftedPlayers, currentPickIndex }) => {
  const numPicks = rounds * 32;
  const limitedDraftOrder = draftCapital.slice(0, numPicks);

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {limitedDraftOrder.map((team, index) => (
        <div key={team.id} className="border-b border-gray-300">
          <TeamInDraft
            pickNumber={index + 1}
            teamName={team.team.team_name}
            logoURL={`/images/${team.team.team_name}.png`}
            draftedPlayer={draftedPlayers[team.team.team_name] || "Upcoming"}
            isOnTheClock={index === currentPickIndex}
          />
        </div>
      ))}
    </div>
  );
};

export default DraftOrderList;