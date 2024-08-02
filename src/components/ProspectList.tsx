// ProspectList.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Prospect from "./Prospect";
import { Select, MenuItem, TextField, SelectChangeEvent } from '@mui/material';

export interface ProspectProps {
  name: string;
  ranking: number;
  school: string;
  position: string;
}

const ProspectList: React.FC = () => {
  const [prospects, setProspects] = useState<ProspectProps[]>([]);
  const [searchPlayer, setSearchPlayer] = useState('');
  const [positionFilter, setPositionFilter] = useState('');

  useEffect(() => {
    const fetchProspects = async () => {
      try {
        const response = await fetch('/api/prospects');
        const data: ProspectProps[] = await response.json();
        setProspects(data);
      } catch (error) {
        console.error('Failed to fetch prospects:', error);
      }
    };
    fetchProspects();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchPlayer(event.target.value);
  };

  const handlePositionChange = (event: SelectChangeEvent<string>) => {
    setPositionFilter(event.target.value);
  };

  const filteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchPlayer.toLowerCase()) &&
    (positionFilter === '' || prospect.position === positionFilter)
  );

  const positions = ['QB', 'WR', 'TE', 'RB', 'OT', 'IOL', 'CB', 'S', 'EDGE', 'DL', 'LB'];

  return (
    <div className="flex flex-col h-full w-96 ">
      <div className="h-1/2 pr-2 pl-2 flex-grow overflow-y-auto">
        <TextField
          label="🔍 Search Players"
          variant="outlined"
          value={searchPlayer}
          onChange={handleSearchChange}
          className="mb-1"
          fullWidth
        />
        <Select
          value={positionFilter}
          onChange={handlePositionChange}
          displayEmpty
          variant="outlined"
          fullWidth
          className="mb-2 w-92"
        >
          <MenuItem value="" className='text-gray-300'>
            <h1 className='text-gray-500'>
              All Positions
            </h1>
          </MenuItem>
          {positions.map(position => (
            <MenuItem key={position} value={position}>
              {position}
            </MenuItem>
          ))}
        </Select>

        {filteredProspects.map((prospect) => (
          <Prospect
            key={prospect.ranking}
            rank={prospect.ranking}
            prospectName={prospect.name}
            position={prospect.position}
            school={prospect.school}
          />
        ))}
      </div>
    </div>
  );
};

export default ProspectList;
