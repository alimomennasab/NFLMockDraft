"use client";
import React from 'react';
import TeamInDraft from './TeamInDraft';
import { DraggableTeam } from './DraftOrderGrid';

interface DraftOrderListProps {
  draftCapital: DraggableTeam[];
  rounds: number;
}

const DraftOrderList: React.FC<DraftOrderListProps> = ({ draftCapital, rounds }) => {
  const numPicks = rounds * 32;
  const limitedDraftOrder = draftCapital.slice(0, numPicks);
  console.log("LIMITED DRAFT ORDER")
  console.log(limitedDraftOrder)
  console.log('ENTIRE DRAFT ORDER')
  console.log(draftCapital)

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      
      {limitedDraftOrder.map((team, index) => (
        <div key={team.id} className="border-b border-gray-300 p-2">
          <TeamInDraft
            pickNumber={team.pick}
            teamName={team.team.team_name}
            logoURL={`/images/${team.team.team_name}.png`}
          />
        </div>
      ))}
    </div>
  );
};

export default DraftOrderList;