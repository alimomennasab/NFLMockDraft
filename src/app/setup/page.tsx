'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import DraftOrderGrid, { DraggableTeam } from '../../components/DraftOrderGrid';
import ResetDraftButton from '../../components/ResetDraftButton';
import SetRoundButtonGroup from '../../components/SetRoundButtonGroup';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useRouter } from 'next/navigation';

export default function SetupPage() {
  const [draftCapital, setDraftCapital] = useState<DraggableTeam[]>([]);
  const [initialDraftCapital, setInitialDraftCapital] = useState<DraggableTeam[]>([]);
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/draftCapital');
        console.log('API Response for fetching draft capital:', response);
        const capital = await response.json();

        const draggableTeams = capital.flatMap((team: any) =>
          team.picks.map((pick: any) => ({
            id: `${team.team_name}-${pick}`,
            team,
            pick
          }))
        );
        draggableTeams.sort((a: { pick: number; }, b: { pick: number; }) => a.pick - b.pick);
        setDraftCapital(draggableTeams);
        setInitialDraftCapital(draggableTeams);
      } catch (error) {
        console.error('Failed to fetch draft capital data:', error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleReset = () => {
    setDraftCapital([...initialDraftCapital]);
  };

  const handleStartDraft = () => {
    sessionStorage.setItem('draftCapital', JSON.stringify(draftCapital));
    sessionStorage.setItem('selectedRounds', selectedRounds.toString());
    router.push('/draft');
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      {isLoading && <LoadingOverlay />}
      <div className="border border-gray-200 rounded-lg p-4 shadow-lg w-full max-w-5xl m-2">
        <div className="flex flex-col items-center w-full">
          <div className="flex flex-col md:flex-row justify-between items-center w-full p-2">
            <div className="font-bold text-2xl md:text-4xl mb-4 md:mb-0">NFL 2025 Mock Draft</div>
            <SetRoundButtonGroup defaultRound={1} onRoundChange={setSelectedRounds} />
          </div>
          <div className="w-full border border-gray-300 rounded-lg p-4">
          <DraftOrderGrid
            draftCapital={draftCapital.slice(0, selectedRounds * 32)}
            setDraftCapital={setDraftCapital}
          />
          </div>
          <div className="flex flex-col items-center mt-3 w-full">
            <div className="italic text-xs text-gray-500 w-full text-center mb-2">
              Modify the draft order by dragging and dropping a team
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center">
              <ResetDraftButton onRestart={handleReset} />
              <Button
                className="!bg-green-600 !text-white !p-3 !flex !justify-center !w-full md:!w-auto !max-w-sm !m-3 !rounded-lg hover:!bg-green-700"
                onClick={handleStartDraft}
              >
                Start Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
