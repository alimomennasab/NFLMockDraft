import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, Select, MenuItem, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { DraftCapital, trade } from '../trade';

interface TradeWindowProps {
  open: boolean;
  onClose: () => void;
  draftCapital: DraftCapital[];
  onTradeSubmit: (updatedTeams: DraftCapital[]) => void;
}

const TradeWindow: React.FC<TradeWindowProps> = ({ open, onClose, draftCapital, onTradeSubmit }) => {
  const [team1, setTeam1] = useState<string>('');
  const [team2, setTeam2] = useState<string>('');
  const [team1Picks, setTeam1Picks] = useState<number[]>([]);
  const [team2Picks, setTeam2Picks] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');

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

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded-lg shadow-lg w-2/3 mx-auto my-20">
        <Typography variant="h6" gutterBottom>Offer Trade</Typography>
        <Select value={team1} onChange={(e) => setTeam1(e.target.value as string)} fullWidth className="mb-4">
          {draftCapital.map(team => (
            <MenuItem key={team.team_name} value={team.team_name}>{team.team_name}</MenuItem>
          ))}
        </Select>
        <div className="flex mb-4">
          {getTeamPicks(team1).map(pick => (
            <FormControlLabel
              key={pick}
              control={
                <Checkbox
                  checked={team1Picks.includes(pick)}
                  onChange={(e) => handlePickChange(team1, pick, e.target.checked)}
                />
              }
              label={`Pick ${pick}`}
              className="mr-2"
            />
          ))}
        </div>
        <Select value={team2} onChange={(e) => setTeam2(e.target.value as string)} fullWidth className="mb-4">
          {draftCapital.map(team => (
            <MenuItem key={team.team_name} value={team.team_name}>{team.team_name}</MenuItem>
          ))}
        </Select>
        <div className="flex mb-4">
          {getTeamPicks(team2).map(pick => (
            <FormControlLabel
              key={pick}
              control={
                <Checkbox
                  checked={team2Picks.includes(pick)}
                  onChange={(e) => handlePickChange(team2, pick, e.target.checked)}
                />
              }
              label={`Pick ${pick}`}
              className="mr-2"
            />
          ))}
        </div>
        <Button onClick={handleTrade} className="mt-4">Submit Trade</Button>
        {message && <Typography className="mt-2">{message}</Typography>}
      </Box>
    </Modal>
  );
};

export default TradeWindow;
