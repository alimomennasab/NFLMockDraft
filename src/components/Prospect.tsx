import React from 'react';
import { Button } from '@mui/material';

interface ProspectProps {
  rank: number;
  prospectName: string;
  position: string;
  school: string;
  onDraft: () => void;
}

const Prospect: React.FC<ProspectProps> = ({ rank, prospectName, position, school, onDraft }) => {
  return (
    <div className="bg-white w-full h-16 border-black rounded border flex flex-row justify-between items-center px-2 mb-1">
      <div className="flex items-center space-x-2 flex-grow">
        <div className="w-6 text-center font-bold">
          {rank}
        </div>
        <div className='flex flex-col justify-center'>
          <div className='text-gray-700 font-bold truncate'>
            {prospectName}
          </div>
          <div className='text-gray-600 text-sm'>
            {school} | {position}
          </div>
        </div>
      </div>
      <Button
        className='!bg-blue-500 !min-w-[60px] !h-8 !rounded-lg !flex !items-center !justify-center !text-white !text-sm hover:!bg-blue-600'
        onClick={onDraft}
      >
        Draft
      </Button>
    </div>
  );
};

export default Prospect;