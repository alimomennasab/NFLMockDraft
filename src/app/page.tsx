"use client";
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import DraftOrderGrid, { TeamData, DraggableTeam } from '../components/DraftOrderGrid';

export default function Page() {
  const [draftCapital, setDraftCapital] = useState<DraggableTeam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/draftCapital');
        const capital: TeamData[] = await response.json();

        let pickCounter = 1; 
        // use api to get the first 32 picks and their corresponding teams
        const draggableTeams = capital.flatMap(team =>
          team.picks.filter(pick => pick <= 32).map(() => ({
            id: `${team.team_name}-${pickCounter}`,
            team,
            pick: pickCounter++
          }))
        );

        setDraftCapital(draggableTeams);
      } catch (error) {
        console.error('Failed to fetch draft capital data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      <div className='md:max-w-5xl flex flex-col items-center'>
        <div className='font-bold p-2 border border-white mb-4 text-4xl md:max-w-5xl'>
          NFL 2025 Mock Draft
        </div>

        <div className='md:max-w-5xl justify-center border border-gray-300 items-center p-3 rounded-lg'>
          <DraftOrderGrid draftCapital={draftCapital} setDraftCapital={setDraftCapital} />
        </div>

        <div className='flex justify-center items-center'>
          <Button className='bg-red-600 text-white p-2 flex justify-center max-w-sm m-4 rounded-lg'>
            Reset Order
          </Button>
          <ButtonGroup className='text-green-600 max-w-sm'>
            <Button className='text-green-600 border border-green-600'>1</Button>
            <Button className='text-green-600 border border-green-600'>2</Button>
            <Button className='text-green-600 border border-green-600'>3</Button>
          </ButtonGroup>
          <Button className='bg-green-600 text-white p-2 flex justify-center max-w-sm m-4 rounded-lg'>
            Start Draft
          </Button>
        </div>
      </div>
    </div>
  );
}
