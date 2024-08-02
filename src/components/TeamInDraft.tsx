import React from 'react';

interface TeamProps {
  pickNumber: number;
  teamName: string;
  logoURL: string;
}

const TeamInDraft: React.FC<TeamProps> = ({ pickNumber, teamName, logoURL }) => {
  return (
    <div className="bg-white max-w-96 w-96 h-16 border-black rounded border flex flex-row justify-between items-center">
      <div className="bg-white w-8 h-12 border-white flex rounded border ml-2 items-center justify-start text-lg font-bold">
        {pickNumber}
      </div>
      <div className='bg-white max-w-30 w-16 flex-1 h-12 border-white flex rounded border items-center justify-start text-lg text-gray-600 px-2'>
        {teamName}
      </div>
      <div className='text-gray-700 mr-2 italic'>
        Upcoming
      </div>
      <div className='bg-white w-12 h-12 m-2 rounded-full flex items-center justify-center'>
        <img src={logoURL} alt="Team Logo" className="w-full h-full object-contain rounded-full" />
      </div>
    </div>
  );
};

export default TeamInDraft;
