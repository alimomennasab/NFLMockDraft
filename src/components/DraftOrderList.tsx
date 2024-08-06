"use client";
import React from 'react';
import TeamInDraft from './TeamInDraft';
import { DraggableTeam } from './DraftOrderGrid';

interface DraftOrderListProps {
  draftCapital: DraggableTeam[];
  rounds: number;
}

const DraftOrderList: React.FC<DraftOrderListProps> = ({ draftCapital, rounds }) => {
  console.log("DraftOrderList render. Draft capital:", draftCapital);
  console.log("Rounds:", rounds);

  const numPicks = rounds * 32;
  const limitedDraftOrder = draftCapital.slice(0, numPicks);

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      {limitedDraftOrder.map((team, index) => (
        <div key={team.id} className="border-b border-gray-300 p-2">
          <TeamInDraft
            pickNumber={index + 1}  // Use the index + 1 as the pick number
            teamName={team.team.team_name}
            logoURL={`/images/${team.team.team_name}.png`}
          />
        </div>
      ))}
    </div>
  );
};

export default DraftOrderList;