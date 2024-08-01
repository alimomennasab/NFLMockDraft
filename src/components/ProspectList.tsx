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
  const [searchQuery, setSearchQuery] = useState('');
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
    setSearchQuery(event.target.value);
  };

  const handlePositionChange = (event: SelectChangeEvent<string>) => {
    setPositionFilter(event.target.value);
  };

  const filteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (positionFilter === '' || prospect.position === positionFilter)
  );

  const uniquePositions = Array.from(new Set(prospects.map(prospect => prospect.position)));

  return (
    <div className="h-full">
      <TextField
        label="Search prospects"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4"
        fullWidth
      />
      <Select
        value={positionFilter}
        onChange={handlePositionChange}
        displayEmpty
        variant="outlined"
        fullWidth
        className="mb-4"
      >
        <MenuItem value="">All Positions</MenuItem>
        {uniquePositions.map(position => (
          <MenuItem key={position} value={position}>{position}</MenuItem>
        ))}
      </Select>
      <div className="overflow-y-auto">
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
