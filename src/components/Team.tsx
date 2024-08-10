import React from 'react';

interface TeamProps {
  pickNumber: number;
  teamName: string;
  logoURL: string;
}

const Team: React.FC<TeamProps> = ({ pickNumber, teamName, logoURL }) => {
  return (
    <div className="bg-white w-full max-w-xs mx-auto h-16 border border-black rounded flex items-center justify-between px-2 sm:px-2">
      <div className="flex items-center flex-1">
        <div className="w-8 h-12 flex items-center justify-center text-lg font-bold">
          {pickNumber}
        </div>
        <div className="flex-1 text-lg text-gray-600 truncate pl-1">
          {teamName}
        </div>
      </div>
      <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden">
        <img src={logoURL} alt={`${teamName} Logo`} className="w-full h-full object-contain" />
      </div>
    </div>
  );
};

export default Team;
