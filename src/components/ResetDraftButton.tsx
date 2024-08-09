import React from 'react';
import { Button } from '@mui/material';

interface ResetDraftButtonProps {
  onRestart: () => void;
}

const ResetDraftButton: React.FC<ResetDraftButtonProps> = ({ onRestart }) => {
  return (
    <Button 
    onClick={onRestart} 
    className="!bg-red-600 !text-white !p-3 !flex !justify-center !w-full md:!w-auto !max-w-sm !m-3 !rounded-lg hover:!bg-red-700"
    >
      Reset Order
    </Button>
  );
};

export default ResetDraftButton;
