import React from 'react';

type DraftPick = {
  teamName: string;
  pickNumber: number;
  playerName: string;
};

interface DraftCompleteWindowProps {
  open: boolean;
  onRestart: () => void;
  draftResults: DraftPick[];
}

const DraftCompleteWindow: React.FC<DraftCompleteWindowProps> = ({ open, onRestart, draftResults }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-7xl w-full m-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Draft Complete!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {draftResults.map((pick) => (
            <div key={pick.pickNumber} className="border rounded p-2 text-sm flex justify-between">
              <div>
                <div className="font-bold">{pick.pickNumber}. {pick.teamName}</div>
                <div>{pick.playerName}</div>
              </div>
              <img src={`/images/${pick.teamName}.png`} alt="Team Logo" className="w-12 h-12 object-contain rounded-full" />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
          >
            Restart Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftCompleteWindow;