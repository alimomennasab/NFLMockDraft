import React from 'react';
import { Button } from '@mui/material';

interface TradeButtonProps {
  onClick: () => void;
}

const TradeButton: React.FC<TradeButtonProps> = ({ onClick }) => {
  return (
    <Button className='!bg-green-600 !text-white !flex !flex-grow !justify-center !max-w !rounded-lg hover:!bg-green-700 !m-2' onClick={onClick}>
      Offer Trade
    </Button>
  );
};

export default TradeButton;
