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

  return (
    <div className="h-full overflow-y-auto">
      {prospects.map((prospect) => (
        <Prospect
          key={prospect.ranking}
          rank={prospect.ranking}
          prospectName={prospect.name}
          position={prospect.position}
          school={prospect.school}
        />
      ))}
    </div>
  );
};

export default ProspectList;
