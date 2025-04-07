'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DraftCompleteWindow from '../../components/DraftCompleteWindow';

type DraftPick = {
  teamName: string;
  pickNumber: number;
  playerName: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const [draftResults, setDraftResults] = useState<DraftPick[]>([]);
  const [showWindow, setShowWindow] = useState(false);

  useEffect(() => {
    const capital = sessionStorage.getItem('draftCapital');
    const drafted = sessionStorage.getItem('draftedPlayers');
    const rounds = sessionStorage.getItem('selectedRounds');

    if (capital && drafted && rounds) {
      const draftCapital = JSON.parse(capital);
      const draftedPlayers = JSON.parse(drafted);
      const selectedRounds = parseInt(rounds);

      const results = draftCapital.slice(0, selectedRounds * 32).map((team: any, index: number) => {
        const pickId = `${team.team.team_name}-${team.pick}`;
        return {
          teamName: team.team.team_name,
          pickNumber: index + 1,
          playerName: draftedPlayers[pickId] || 'NA'
        };
      });

      setDraftResults(results);
      setShowWindow(true);
    } else {
      router.push('/setup');
    }
  }, []);

  const handleRestart = () => {
    sessionStorage.clear();
    router.push('/setup');
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {showWindow && (
        <DraftCompleteWindow
          open={true}
          onRestart={handleRestart}
          draftResults={draftResults}
        />
      )}
    </div>
  );
}
