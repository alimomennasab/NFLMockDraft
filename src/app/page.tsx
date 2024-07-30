"use client";
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import DraftOrderGrid, { TeamData, DraggableTeam } from '../components/DraftOrderGrid';
import ResetDraftButton from '../components/ResetDraftButton';

export default function Page() {
  const [draftCapital, setDraftCapital] = useState<DraggableTeam[]>([]);
  const [initialDraftCapital, setInitialDraftCapital] = useState<DraggableTeam[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/draftCapital');
        const capital: TeamData[] = await response.json();

        // use api to get the first 32 picks and their corresponding teams
        let pickCounter = 1; // Initialize the pick counter

        const draggableTeams = capital.flatMap(team =>
          team.picks.filter(pick => pick <= 32).map(() => ({
            id: `${team.team_name}-${pickCounter}`, // Assign a unique ID based on pickCounter
            team,
            pick: pickCounter++ // Assign the overall pick number
          }))
        );

        setDraftCapital(draggableTeams);
        setInitialDraftCapital(draggableTeams); // Save the initial state
      } catch (error) {
        console.error('Failed to fetch draft capital data:', error);
      }
    };
    fetchData();
  }, []);

  const handleReset = () => {
    // creates a new array reference, which leads to a state change
    setDraftCapital([...initialDraftCapital]);
  };

  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      <div className='md:max-w-5xl flex flex-col items-center w-full'>
        <div className='font-bold p-2 border border-white text-4xl w-full text-center'>
          NFL 2025 Mock Draft
        </div>
        <div className='italic pb-2 border border-white text-xs text-gray-700 w-full text-center'>
          Modify the draft order by dragging and dropping each team
        </div>

        <div className='md:max-w-5xl justify-center border border-gray-300 items-center p-4 rounded-lg w-full'>
          <DraftOrderGrid draftCapital={draftCapital} setDraftCapital={setDraftCapital} />
        </div>

        <div className='flex justify-between items-center w-full mt-4 border border-gray-300 rounded-lg'>
          <div className='flex items-center'>
            <h1 className='mr-4 p-2'>Rounds</h1>
            <ButtonGroup className='text-green-600'>
              <Button>1</Button>
              <Button>2</Button>
              <Button>3</Button>
            </ButtonGroup>
          </div>

          <div className='flex justify-center items-center'>
            <ResetDraftButton onRestart={handleReset} />
            <Button className='bg-green-600 text-white p-2 flex justify-center max-w-sm m-4 rounded-lg hover:bg-green-700'>
              Start Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
