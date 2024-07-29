import React from 'react';

interface ProspectProps {
  pickNumber: number;
  prospectName: string;
  position: string;
  logoURL: string;
}

const Prospect: React.FC<ProspectProps> = ({ pickNumber, prospectName, position, logoURL }) => {
  return (
    <div className="bg-white w-80 h-16 border-black rounded border flex flex-row justify-between items-center">
      <div className="bg-white w-8 h-12 border-white flex rounded border m-1 items-center justify-start text-lg font-bold">
        #{pickNumber}
      </div>
      <div className='bg-white w-56 h-12 border-white flex rounded border items-center justify-start text-lg'>
        {prospectName} <span>&nbsp;</span><span className="italic">{position}</span>
      </div>
      <div className='bg-white w-12 h-12 border-black border m-1 rounded-full flex items-center justify-center'>
        <img src={logoURL} alt="Img" className="w-full h-full object-cover rounded-full" />
      </div>
    </div>
  );
};

export default Prospect;
