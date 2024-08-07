import React from 'react';

interface DraftCompleteWindowProps {
  open: boolean;
  onRestart: () => void;
}

const DraftCompleteWindow: React.FC<DraftCompleteWindowProps> = ({ open, onRestart }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Draft Complete!</h2>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onRestart}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Restart Draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default DraftCompleteWindow;