import React from 'react';
import { Button } from '@mui/material';


const TradeButton: React.FC = () => {
  return (
    <Button className='bg-green-600 text-white flex flex-grow justify-center max-w rounded-lg hover:bg-green-700 m-2'>
        Offer Trade
    </Button>
  );
};

export default TradeButton;


