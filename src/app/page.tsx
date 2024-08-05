'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import DraftOrderGrid, { DraggableTeam, TeamData } from '../components/DraftOrderGrid';
import ResetDraftButton from '../components/ResetDraftButton';
import SetRoundButtonGroup from '../components/SetRoundButtonGroup';
import ProspectList from '../components/ProspectList';
import DraftOrderList from '../components/DraftOrderList';
import TradeButton from '../components/TradeButton';
import TradeWindow from '../components/TradeWindow';

export default function Page() {
  const [draftCapital, setDraftCapital] = useState<DraggableTeam[]>([]);
  const [initialDraftCapital, setInitialDraftCapital] = useState<DraggableTeam[]>([]);
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [draftStarted, setDraftStarted] = useState(false);
  const [tradeWindowOpen, setTradeWindowOpen] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/draftCapital');
        const capital: TeamData[] = await response.json();

        const draggableTeams = capital.flatMap(team =>
          team.picks.map(pick => ({
            id: `${team.team_name}-${pick}`,
            team,
            pick
          }))
        );

        draggableTeams.sort((a, b) => a.pick - b.pick);

        setDraftCapital(draggableTeams);
        setInitialDraftCapital(draggableTeams);
      } catch (error) {
        console.error('Failed to fetch draft capital data:', error);
      }
    };
    fetchData();
  }, []);

  const handleReset = () => {
    setDraftCapital([...initialDraftCapital]);
  };

  const handleRoundChange = (round: number) => {
    setSelectedRounds(round);
  };

  const startDraft = () => {
    setDraftStarted(true);
  };

  const handleTradeSubmit = (updatedTeams: TeamData[]) => {
    console.log("Trade submitted. Updated teams:", updatedTeams);
  
    const updatedDraftCapital = draftCapital.map(dc => {
      const updatedTeam = updatedTeams.find(team => team.team_name === dc.team.team_name);
      if (updatedTeam) {
        return {
          ...dc,
          team: updatedTeam,
          pick: updatedTeam.picks.includes(dc.pick) ? dc.pick : updatedTeam.picks.find(p => !draftCapital.some(existingDc => existingDc.team.team_name === updatedTeam.team_name && existingDc.pick === p)) || dc.pick
        };
      }
      return dc;
    });
  
    console.log("Updated draft capital:", updatedDraftCapital);
    setDraftCapital(updatedDraftCapital);
  };

  const limitedDraftCapital = draftCapital.slice(0, 32 * selectedRounds);

  return (
    <div className="flex justify-center items-center h-screen flex-col">
      {!draftStarted ? (
        <div className="border border-gray-200 rounded-lg p-6 shadow-lg w-full h-full md:w-auto">
          <div className="md:max-w-5xl flex flex-col items-center w-full">
            <div className="flex justify-between items-center w-full p-4">
              <div className="font-bold text-4xl">NFL 2025 Mock Draft</div>
              <SetRoundButtonGroup defaultRound={1} onRoundChange={handleRoundChange} />
            </div>

            <div className="md:max-w-5xl justify-center border border-gray-300 items-center p-4 rounded-lg w-full">
              <DraftOrderGrid
                draftCapital={limitedDraftCapital}
                setDraftCapital={setDraftCapital}
              />
            </div>

            <div className="flex flex-col items-center mt-3 w-full">
              <div className="italic text-xs text-gray-500 w-full text-center">
                Modify the draft order by dragging and dropping a team
              </div>
              <div className="flex justify-center items-center">
                <ResetDraftButton onRestart={handleReset} />
                <Button
                  className="bg-green-600 text-white p-3 flex justify-center max-w-sm m-3 rounded-lg hover:bg-green-700"
                  onClick={startDraft}
                >
                  Start Draft
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-start h-screen p-4">
          <div className="flex w-full h-full space-x-4 border border-gray-200 rounded-lg">
            <div className="w-1/2">
              <DraftOrderList draftCapital={draftCapital} rounds={selectedRounds} />
            </div>
            <div className="w-1/2 border border-gray-200 rounded-lg mt-2 flex flex-col ">
              <TradeButton onClick={() => setTradeWindowOpen(true)} />
              <ProspectList />
              {tradeMessage && <div className="p-2 text-center text-red-500">{tradeMessage}</div>}
            </div>
          </div>
        </div>
      )}
      <TradeWindow
        open={tradeWindowOpen}
        onClose={() => {
          setTradeWindowOpen(false);
          setTimeout(() => setTradeMessage(''), 500); // clear message after closing
        }}
        draftCapital={draftCapital.map(dc => dc.team)}
        onTradeSubmit={handleTradeSubmit}
      />
    </div>
  );
}
