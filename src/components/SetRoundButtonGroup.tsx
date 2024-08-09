import React, { useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';

interface SetRoundButtonGroupProps {
  defaultRound?: number;
  onRoundChange: (round: number) => void;
}

const SetRoundButtonGroup: React.FC<SetRoundButtonGroupProps> = ({ defaultRound = 1, onRoundChange }) => {
  const [selectedRound, setSelectedRound] = useState(defaultRound);

  const handleRoundChange = (round: number) => {
    setSelectedRound(round);
    onRoundChange(round);
  };

  return (
    <div className='flex items-center'>
      <h1 className='pr-2'>Rounds</h1>
      <ButtonGroup className='text-green-600'>
        <Button
          onClick={() => handleRoundChange(1)}
          className={selectedRound === 1 ? '!bg-blue-500 !text-white hover:!bg-blue-500' : ''}
        >
          1
        </Button>
        <Button
          onClick={() => handleRoundChange(2)}
          className={selectedRound === 2 ? '!bg-blue-500 !text-white hover:!bg-blue-500' : ''}
        >
          2
        </Button>
        <Button
          onClick={() => handleRoundChange(3)}
          className={selectedRound === 3 ? '!bg-blue-500 !text-white hover:!bg-blue-500' : ''}
        >
          3
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default SetRoundButtonGroup;
