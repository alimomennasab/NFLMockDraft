"use client"
import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import DraftOrderGrid, { DraggableTeam } from '../components/DraftOrderGrid';
import ResetDraftButton from '../components/ResetDraftButton';
import SetRoundButtonGroup from '../components/SetRoundButtonGroup';
import ProspectList, {ProspectProps} from '../components/ProspectList';
import DraftOrderList from '../components/DraftOrderList';
import TradeButton from '../components/TradeButton';
import TradeWindow from '../components/TradeWindow';
import { DraftCapital } from '../trade';
import DraftCompleteWindow from '../components/DraftCompleteWindow';

type DraftPick = {
  teamName: string;
  pickNumber: number;
  playerName: string;
};

export default function Page() {
  const [draftCapital, setDraftCapital] = useState<DraggableTeam[]>([]);
  const [initialDraftCapital, setInitialDraftCapital] = useState<DraggableTeam[]>([]);
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [draftStarted, setDraftStarted] = useState(false);
  const [tradeWindowOpen, setTradeWindowOpen] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');
  const [draftedPlayers, setDraftedPlayers] = useState<{ [key: string]: string }>({});
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [isDraftComplete, setIsDraftComplete] = useState(false);
  const [showDraftCompleteWindow, setShowDraftCompleteWindow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/draftCapital');
        const capital: DraftCapital[] = await response.json();

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

  const handleTradeSubmit = (updatedTeams: DraftCapital[]) => {
    console.log("Trade submitted. Updated teams:", updatedTeams);
  
    const updatedDraftCapital = updatedTeams.flatMap(team =>
      team.picks.map(pick => ({
        id: `${team.team_name}-${pick}`,
        team,
        pick
      }))
    );
  
    // Remove duplicates based on the 'id' property
    const uniqueUpdatedDraftCapital = Array.from(
      new Map(updatedDraftCapital.map(item => [item.id, item])).values()
    );
  
    // Sort the unique updated draft capital by pick number
    uniqueUpdatedDraftCapital.sort((a, b) => a.pick - b.pick);
  
    console.log("Updated draft capital:", uniqueUpdatedDraftCapital);
    setDraftCapital(uniqueUpdatedDraftCapital);
  };

  const handleDraft = (prospect: ProspectProps) => {
    const totalPicks = selectedRounds * 32;
    if (currentPickIndex < totalPicks) {
      console.log(prospect.name + " drafted at pick " + (currentPickIndex + 1));
      const currentTeam = draftCapital[currentPickIndex].team.team_name;
      setDraftedPlayers(prev => ({
        ...prev,
        [currentTeam]: prospect.name
      }));
      
      const nextPickIndex = currentPickIndex + 1;
      setCurrentPickIndex(nextPickIndex);
  
      if (nextPickIndex >= totalPicks) {
        setIsDraftComplete(true);
        setShowDraftCompleteWindow(true);
      }
    }
  };

  const generateDraftResults = (): DraftPick[] => {
    return draftCapital.slice(0, selectedRounds * 32).map((team, index) => ({
      teamName: team.team.team_name,
      pickNumber: index + 1,
      playerName: draftedPlayers[team.team.team_name] || 'N/A'
    }));
  };

  const handleRestartDraft = () => {
    setDraftedPlayers({});
    setCurrentPickIndex(0);
    setIsDraftComplete(false);
    setShowDraftCompleteWindow(false);
    setDraftCapital([...initialDraftCapital]);
    setSelectedRounds(1);
    setDraftStarted(false);
  };

  const limitedDraftCapital = draftCapital.slice(0, 32 * selectedRounds);

  return (
    <div className="flex justify-center items-center min-h-screen p-2">
      {!isDraftComplete ? (
        <>
          {!draftStarted ? (
            <div className="border border-gray-200 rounded-lg p-4 shadow-lg w-full max-w-5xl">
              <div className="flex flex-col items-center w-full">
                <div className="flex flex-col md:flex-row justify-between items-center w-full p-4">
                  <div className="font-bold text-2xl md:text-4xl mb-4 md:mb-0">NFL 2025 Mock Draft</div>
                  <SetRoundButtonGroup defaultRound={1} onRoundChange={handleRoundChange} />
                </div>

                <div className="w-full border border-gray-300 rounded-lg p-4">
                  <DraftOrderGrid
                    draftCapital={limitedDraftCapital}
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
                      onClick={startDraft}
                    >
                      Start Draft
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row justify-center items-start w-full h-full space-y-4 md:space-y-0 md:space-x-4">
              <div className="w-full md:w-1/2">
                <DraftOrderList 
                  draftCapital={draftCapital.slice(0, selectedRounds * 32)} 
                  rounds={selectedRounds} 
                  draftedPlayers={draftedPlayers} 
                  currentPickIndex={currentPickIndex}
                />
              </div>
              <div className="w-full md:w-1/2 border border-gray-200 rounded-lg mt-2 flex flex-col">
                <TradeButton onClick={() => setTradeWindowOpen(true)} />
                <ProspectList onDraft={handleDraft}/>
                {tradeMessage && <div className="p-2 text-center text-red-500">{tradeMessage}</div>}
              </div>
            </div>
          )}
          <TradeWindow
            open={tradeWindowOpen}
            onClose={() => {
              setTradeWindowOpen(false);
              setTimeout(() => setTradeMessage(''), 500);
            }}
            draftCapital={draftCapital.map(dc => dc.team)}
            onTradeSubmit={handleTradeSubmit}
          />
        </>
      ) : (
        <DraftCompleteWindow 
          open={showDraftCompleteWindow}
          onRestart={handleRestartDraft}
          draftResults={generateDraftResults()}
        />
      )}
    </div>
  );
}