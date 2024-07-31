"use client";
import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import DraftOrderGrid, { TeamData, DraggableTeam } from '../components/DraftOrderGrid';
import ResetDraftButton from '../components/ResetDraftButton';
import SetRoundButtonGroup from '../components/SetRoundButtonGroup'; 
import Prospect from '../components/Prospect';

export default function Page() {
  const [draftCapital, setDraftCapital] = useState<DraggableTeam[]>([]);
  const [initialDraftCapital, setInitialDraftCapital] = useState<DraggableTeam[]>([]);
  const [selectedRound, setSelectedRound] = useState(1); 
  const [draftStarted, setDraftStarted] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/draftCapital');
        const capital: TeamData[] = await response.json();

        // use api to get the first 32 picks and their corresponding teams
        let pickCounter = 1; // initialize the pick counter

        const draggableTeams = capital.flatMap(team =>
          team.picks.filter(pick => pick <= 32).map(() => ({
            id: `${team.team_name}-${pickCounter}`, // assign a unique ID based on pickCounter
            team,
            pick: pickCounter++ // assign the overall pick number
          }))
        );

        setDraftCapital(draggableTeams);
        setInitialDraftCapital(draggableTeams); // save the initial state
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

  const handleRoundChange = (round: number) => {
    setSelectedRound(round); 
  };

  const startDraft = () => {
    setDraftStarted(true); 
  };

  return (
    <div className='flex justify-center items-center h-screen flex-col'>
      {!draftStarted ? (
        <div className='border border-gray-200 rounded-lg p-6 shadow-lg w-full h-full md:w-auto'>
          <div className='md:max-w-5xl flex flex-col items-center w-full'>
            <div className='flex justify-between items-center w-full p-4'>
              <div className='font-bold text-4xl'>
                NFL 2025 Mock Draft
              </div>
              <SetRoundButtonGroup defaultRound={1} onRoundChange={handleRoundChange} />
            </div>

            <div className='md:max-w-5xl justify-center border border-gray-300 items-center p-4 rounded-lg w-full'>
              <DraftOrderGrid draftCapital={draftCapital} setDraftCapital={setDraftCapital} />
            </div>

            <div className='flex flex-col items-center mt-3 w-full'>
              <div className='italic text-xs text-gray-500 w-full text-center'>
                Modify the draft order by dragging and dropping a team
              </div>
              <div className='flex justify-center items-center'>
                <ResetDraftButton onRestart={handleReset} />
                <Button 
                  className='bg-green-600 text-white p-3 flex justify-center max-w-sm m-3 rounded-lg hover:bg-green-700'
                  onClick={startDraft} // Add onClick handler to start the draft
                >
                  Start Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='border border-gray-200 rounded-lg p-6 shadow-lg w-full h-full md:w-auto'>
          <h1>Draft Page</h1>
          <p>Number of rounds: {selectedRound}</p>
          <Prospect rank={1} prospectName={'Luther Burden'} position={'WR'} logoURL={''}></Prospect>
          <Prospect rank={1} prospectName={'Quinshon Judkins'} position={'RB'} logoURL={''}></Prospect>
        </div>
      )}
    </div>
  );
}
