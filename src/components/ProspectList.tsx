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
    <div className="flex flex-col h-full w-full">
      <div className="p-2">
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
          className=""
        >
          <MenuItem value="" className='text-gray-300'>
            <span className='text-gray-500'>All Positions</span>
          </MenuItem>
          {positions.map(position => (
            <MenuItem key={position} value={position}>
              {position}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className="flex-grow overflow-y-auto p-2 h-0">
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
