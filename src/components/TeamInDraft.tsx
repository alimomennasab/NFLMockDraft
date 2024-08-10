import React from 'react';

interface TeamProps {
  pickNumber: number;
  teamName: string;
  logoURL: string;
  draftedPlayer: string;
  isOnTheClock: boolean;
}

const TeamInDraft: React.FC<TeamProps> = ({ pickNumber, teamName, logoURL, draftedPlayer, isOnTheClock }) => {
  return (
    <div className="bg-white w-11/12 h-16 border-black rounded border flex flex-row justify-between items-center px-2 m-2">
      <div className="flex items-center space-x-2 flex-grow">
        <div className="w-6 text-center font-bold">
          {pickNumber}
        </div>
        <div className='flex-grow truncate text-gray-600'>
          {teamName}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`text-sm ${
          isOnTheClock
            ? 'font-bold text-green-600'
            : draftedPlayer === "Upcoming"
            ? 'italic text-gray-700'
            : 'font-bold text-black'
        }`}>
          {isOnTheClock ? "On the clock" : draftedPlayer}
        </div>
        <div className='w-10 h-10 rounded-full flex-shrink-0 overflow-hidden'>
          <img src={logoURL} alt="Team Logo" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
};

export default TeamInDraft;