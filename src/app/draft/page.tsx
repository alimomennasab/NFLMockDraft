'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TradeButton from '../../components/TradeButton';
import TradeWindow from '../../components/TradeWindow';
import ProspectList, { ProspectProps } from '../../components/ProspectList';
import DraftOrderList from '../../components/DraftOrderList';
import { DraftCapital } from '../../trade';
import LoadingOverlay from '../../components/LoadingOverlay';

export default function DraftPage() {
  const router = useRouter();
  const [draftCapital, setDraftCapital] = useState<any[]>([]);
  const [selectedRounds, setSelectedRounds] = useState(1);
  const [draftedPlayers, setDraftedPlayers] = useState<{ [key: string]: string }>({});
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [tradeWindowOpen, setTradeWindowOpen] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const capital = sessionStorage.getItem('draftCapital');
    const rounds = sessionStorage.getItem('selectedRounds');
    if (capital && rounds) {
      const parsed = JSON.parse(capital);
      parsed.sort((a: any, b: any) => a.pick - b.pick);
      setDraftCapital(parsed);
      setSelectedRounds(parseInt(rounds));
      setIsLoading(false);
    } else {
      router.push('/setup');
    }
  }, []);

  const handleDraft = (prospect: ProspectProps) => {
    const totalPicks = selectedRounds * 32;
    if (currentPickIndex < totalPicks) {
      const currentPick = draftCapital[currentPickIndex];
      const pickId = `${currentPick.team.team_name}-${currentPick.pick}`;
      const updatedPlayers = {
        ...draftedPlayers,
        [pickId]: prospect.name,
      };
      setDraftedPlayers(updatedPlayers);
      setCurrentPickIndex(currentPickIndex + 1);

      if (currentPickIndex + 1 >= totalPicks) {
        sessionStorage.setItem('draftedPlayers', JSON.stringify(updatedPlayers));
        router.push('/results');
      }
    }
  };

  const handleTradeSubmit = (updatedTeams: DraftCapital[]) => {
    const updatedDraftCapital = updatedTeams.flatMap(team =>
      team.picks.filter(pick => pick > currentPickIndex).map(pick => ({
        id: `${team.team_name}-${pick}`,
        team,
        pick
      }))
    );
    const unique = Array.from(new Map(updatedDraftCapital.map(item => [item.id, item])).values());
    unique.sort((a, b) => a.pick - b.pick);
    setDraftCapital(unique);
  };

  return (
    <div className="flex justify-center items-start min-h-screen p-4">
      {isLoading && <LoadingOverlay />}
      <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-5xl mx-auto space-y-2 md:space-y-0 md:space-x-2 border border-gray-300 rounded-lg p-2 m-5 h-[90vh]">
        <div className="w-full md:w-[43%] border border-gray-200 rounded-lg overflow-hidden h-1/2 md:h-full">
          <div className="h-full overflow-y-auto">
            <DraftOrderList
              draftCapital={draftCapital.slice(0, selectedRounds * 32)}
              rounds={selectedRounds}
              draftedPlayers={draftedPlayers}
              currentPickIndex={currentPickIndex}
            />
          </div>
        </div>
        <div className="w-full md:w-[53%] flex flex-col h-1/2 md:h-full">
          <TradeButton onClick={() => setTradeWindowOpen(true)} />
          <div className="flex-grow border border-gray-200 rounded-lg mt-2 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <ProspectList onDraft={handleDraft} />
            </div>
          </div>
          {tradeMessage && <div className="p-2 text-center text-red-500">{tradeMessage}</div>}
        </div>
      </div>
      <TradeWindow
        open={tradeWindowOpen}
        onClose={() => {
          setTradeWindowOpen(false);
          setTimeout(() => setTradeMessage(''), 500);
        }}
        draftCapital={draftCapital.map(dc => dc.team)}
        onTradeSubmit={handleTradeSubmit}
        currentPickIndex={currentPickIndex}
      />
    </div>
  );
}
