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
      {limitedDraftOrder.map((team, index) => {
        const pickId = `${team.team.team_name}-${team.pick}`;
        const draftedPlayer = draftedPlayers[pickId] || "Upcoming";
        
        return (
          <div key={team.id} className="border-b border-gray-300 p-2">
            <TeamInDraft
              pickNumber={index + 1}
              teamName={team.team.team_name}
              logoURL={`/images/${team.team.team_name}.png`}
              draftedPlayer={draftedPlayer}
              isOnTheClock={index === currentPickIndex}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DraftOrderList;