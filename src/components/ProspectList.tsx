"use client";
import React, { useEffect, useState } from 'react';
import Prospect from "./Prospect";

export interface ProspectProps {
  name: string;
  ranking: number;
  school: string;
  position: string;
}

export interface ProspectListProps {
  prospectList: ProspectProps[];
}

const ProspectList: React.FC = () => {
  const [prospects, setProspects] = useState<ProspectProps[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredProspects = prospects.filter(prospect =>
    prospect.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full">
      <input
        type="text"
        placeholder="Search prospects"
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded"
      />
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
