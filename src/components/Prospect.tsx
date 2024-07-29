import React from 'react';

interface ProspectProps {
  rank: number;
  prospectName: string;
  position: string;
  logoURL: string;
}

const Prospect: React.FC<ProspectProps> = ({ rank, prospectName, position, logoURL }) => {
  return (
    <div className="bg-white w-96 h-16 border-black rounded border flex flex-row justify-between items-center">
      <div className="bg-white w-8 h-12 border-white flex rounded border ml-2 items-center justify-start text-lg font-bold">
        {rank}
      </div>
      <div className='bg-white flex-1 h-12 border-white flex rounded border items-center justify-start text-lg text-gray-700 px-2'>
        {prospectName} | {position}
      </div>
      <div className='bg-white w-12 h-12 border-black border m-1 rounded-full flex items-center justify-center'>
        <img src={logoURL} alt="Img" className="w-full h-full object-cover rounded-full" />
      </div>
      <button className='bg-blue-500 w-24 h-10 rounded-lg flex items-center justify-center m-2 text-white'>
        Draft
      </button>
    </div>
  );
};

export default Prospect;
