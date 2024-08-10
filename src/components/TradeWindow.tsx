import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Select, MenuItem, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { DraftCapital, trade } from '../trade';

interface TradeWindowProps {
  open: boolean;
  onClose: () => void;
  draftCapital: DraftCapital[];
  onTradeSubmit: (updatedTeams: DraftCapital[]) => void;
  currentPickIndex: number;
}

const TradeWindow: React.FC<TradeWindowProps> = ({ open, onClose, draftCapital, onTradeSubmit, currentPickIndex }) => {
  const [team1, setTeam1] = useState<string>('');
  const [team2, setTeam2] = useState<string>('');
  const [team1Picks, setTeam1Picks] = useState<number[]>([]);
  const [team2Picks, setTeam2Picks] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');

  // show only 32 team names as trade partners 
  const uniqueTeamNames = Array.from(new Set(draftCapital.map(team => team.team_name)));
  const noDupeTeamNames = uniqueTeamNames.map(teamName => 
    draftCapital.find(team => team.team_name === teamName)!
  );

  useEffect(() => {
    setTeam1Picks([]);
    setTeam2Picks([]);
    setMessage('');
  }, [open]);

  const handleTrade = async () => {
    try {
      const result = await trade(draftCapital, team1, team2, team1Picks, team2Picks);
      setMessage(result.message);
      if (result.success) {
        onTradeSubmit(result.updatedTeams);
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 3000);
      }
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const handlePickChange = (team: string, pick: number, checked: boolean) => {
    if (team === team1) {
      setTeam1Picks(prev => checked ? [...prev, pick] : prev.filter(p => p !== pick));
    } else if (team === team2) {
      setTeam2Picks(prev => checked ? [...prev, pick] : prev.filter(p => p !== pick));
    }
  };

  const getTeamPicks = (teamName: string) => {
    const team = draftCapital.find(t => t.team_name === teamName);
    return team ? team.picks : [];
  };

  const isPickUsed = (pick: number) => pick <= currentPickIndex;

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-11/12 sm:w-4/5 md:w-3/4 lg:w-2/3 max-w-3xl mx-auto my-4 sm:my-20 overflow-y-auto max-h-[90vh]">
        <Typography variant="h6" gutterBottom className="text-center">Offer Trade</Typography>
        <Select value={team1} onChange={(e) => setTeam1(e.target.value as string)} fullWidth className="mb-4">
          {noDupeTeamNames.map(team => (
            <MenuItem key={team.team_name} value={team.team_name}>{team.team_name}</MenuItem>
          ))}
        </Select>
        <div className="flex flex-wrap mb-4 gap-2">
          {getTeamPicks(team1).map(pick => (
            <FormControlLabel
              key={pick}
              control={
                <Checkbox
                  checked={team1Picks.includes(pick)}
                  onChange={(e) => handlePickChange(team1, pick, e.target.checked)}
                  disabled={isPickUsed(pick)}
                />
              }
              label={`Pick ${pick}`}
              className={`mr-2 ${isPickUsed(pick) ? 'text-gray-400' : ''}`}
            />
          ))}
        </div>
        <Select value={team2} onChange={(e) => setTeam2(e.target.value as string)} fullWidth className="mb-4">
          {noDupeTeamNames.map(team => (
            <MenuItem key={team.team_name} value={team.team_name}>{team.team_name}</MenuItem>
          ))}
        </Select>
        <div className="flex flex-wrap mb-4 gap-2">
          {getTeamPicks(team2).map(pick => (
            <FormControlLabel
              key={pick}
              control={
                <Checkbox
                  checked={team2Picks.includes(pick)}
                  onChange={(e) => handlePickChange(team2, pick, e.target.checked)}
                  disabled={isPickUsed(pick)}
                />
              }
              label={`Pick ${pick}`}
              className={`mr-2 ${isPickUsed(pick) ? 'text-gray-400' : ''}`}
            />
          ))}
        </div>
        <div className='flex flex-col sm:flex-row justify-between gap-2'>
          <Button onClick={handleTrade} className="!mt-4 !bg-green-600 !text-white hover:!bg-green-700 !w-full sm:!w-auto">Submit Trade</Button>
          <Button onClick={onClose} className="!mt-4 !bg-red-600 !text-white hover:!bg-red-700 !w-full sm:!w-auto">Exit Trade</Button>
        </div>
        {message && <Typography className="mt-2 text-center">{message}</Typography>}
      </Box>
    </Modal>
  );
};

export default TradeWindow;