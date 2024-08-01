import React from 'react';
import { Button } from '@mui/material';

interface ProspectProps {
  rank: number;
  prospectName: string;
  position: string;
  school: string;
}

const Prospect: React.FC<ProspectProps> = ({ rank, prospectName, position, school }) => {
  return (
    <div className="bg-white w-96 h-16 border-black rounded border flex flex-row justify-left items-center m-2">
      <div className="bg-white w-8 h-12 border-white flex rounded border ml-2 items-center justify-start text-lg font-bold">
        {rank}
      </div>

      <div className='flex flex-col p-2 text-left w-56'>
        <div className='bg-white flex-1 h-12 border-white flex items-center text-lg text-gray-700 font-bold'>
          {prospectName}
        </div>
        <div className='text-gray-700'>
          {school} | {position}
        </div>
      </div>

      <Button className='bg-blue-500 w-24 h-10 rounded-lg flex items-center justify-center m-2 text-white hover:bg-blue-600'>
        Draft
      </Button>
    </div>
  );
};

export default Prospect;
