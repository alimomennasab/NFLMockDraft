"use client";

import React, { useEffect, useState } from 'react';
import Prospect from '../components/Prospect';
import Team from '../components/Team';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

interface TeamData {
  team_name: string;
  picks: number[];
}

export default function Page() {
  const [draftCapital, setDraftCapital] = useState<TeamData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/draftCapital');
        const capital: TeamData[] = await response.json();
        setDraftCapital(capital);
        console.log(capital)
      } catch (error) {
        console.error('Failed to fetch draft capital data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      {/*
      <Prospect 
        rank={1} 
        prospectName="Luther Burden" 
        position="WR" 
        logoURL="images/mizzou.png" 
      />
      */}
      <div className='md:max-w-5xl flex flex-col items-center'>
        <div className='font-bold p-2 border border-white mb-4 text-4xl md:max-w-5xl'> 
          NFL 2025 Mock Draft
        </div>
        <div className='md:max-w-5xl justify-center border border-gray-300 items-center p-3 rounded-lg'>
          <div className='grid grid-cols-4 gap-2'>
            {draftCapital.flatMap((team, teamIndex) => (
              team.picks.map((pick) => (
                pick <= 32 && (
                  <div
                    key={`${team.team_name}-${pick}`}
                    className={`col-span-1 row-span-1`}
                    style={{ gridColumn: (teamIndex % 4) + 1 }}
                  >
                    <Team
                      pickNumber={pick}
                      teamName={team.team_name}
                      logoURL={'images/mizzou.png'}  // Adjust the path as needed
                    />
                  </div>
                )
              ))
            ))}
          </div>
        </div>
        <div className='flex justify-center items-center'>
        <ButtonGroup className='text-green-600 max-w-sm'>
          <Button className='text-green-600 border border-green-600'>1</Button>
          <Button className='text-green-600 border border-green-600'>2</Button>
          <Button className='text-green-600 border border-green-600'>3</Button>
        </ButtonGroup>
          <button className='bg-green-600 text-white p-2 flex justify-center max-w-sm m-4 rounded-lg'>
            Start Draft
          </button>
        </div>

      </div>
    </div>
  );
}
