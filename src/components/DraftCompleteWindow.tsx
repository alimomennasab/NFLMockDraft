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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 md:p-8 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Draft Complete!</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {draftResults.map((pick) => (
            <div key={pick.pickNumber} className="border rounded p-2 text-sm flex justify-between items-center">
              <div className="flex-grow mr-2">
                <div className="font-bold text-xs sm:text-sm">{pick.pickNumber}. {pick.teamName}</div>
                <div className="text-xs sm:text-sm truncate">{pick.playerName}</div>
              </div>
              <img 
                src={`/images/${pick.teamName}.png`} 
                alt="Team Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 object-contain rounded-full flex-shrink-0" 
              />
            </div>
          ))}
        </div>
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 sm:px-6 rounded text-sm sm:text-base"
          >
            Restart Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftCompleteWindow;