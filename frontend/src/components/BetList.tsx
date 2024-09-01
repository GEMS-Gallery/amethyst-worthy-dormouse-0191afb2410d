import React, { useState } from 'react';
import { List, ListItem, Card, CardContent, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Chip, Box } from '@mui/material';
import { backend } from 'declarations/backend';

interface Bet {
  id: string;
  description: string;
  creator: string;
  counterparty: string | null;
  creatorProposedOutcome: string | null;
  counterpartyProposedOutcome: string | null;
  finalOutcome: string | null;
  createdAt: bigint;
  status: string;
  smartContractAddress: string | null;
  category: string;
}

interface BetListProps {
  bets: Bet[];
  onBetUpdated: () => void;
}

const BetList: React.FC<BetListProps> = ({ bets, onBetUpdated }) => {
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null);
  const [proposedOutcome, setProposedOutcome] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAcceptBet = async (betId: string) => {
    try {
      const result = await backend.acceptBet(betId);
      if ('ok' in result) {
        console.log('Bet accepted:', result.ok);
        onBetUpdated();
      } else {
        console.error('Error accepting bet:', result.err);
      }
    } catch (error) {
      console.error('Error accepting bet:', error);
    }
  };

  const handleProposeOutcome = (bet: Bet) => {
    setSelectedBet(bet);
    setProposedOutcome('');
    setDialogOpen(true);
  };

  const handleSubmitOutcome = async () => {
    if (selectedBet && proposedOutcome) {
      try {
        const result = await backend.proposeOutcome(selectedBet.id, proposedOutcome);
        if ('ok' in result) {
          console.log('Outcome proposed:', result.ok);
          onBetUpdated();
        } else {
          console.error('Error proposing outcome:', result.err);
        }
      } catch (error) {
        console.error('Error proposing outcome:', error);
      }
    }
    setDialogOpen(false);
  };

  const handleAgreeOnOutcome = async (betId: string) => {
    try {
      const result = await backend.agreeOnOutcome(betId);
      if ('ok' in result) {
        console.log('Outcome agreed:', result.ok);
        onBetUpdated();
      } else {
        console.error('Error agreeing on outcome:', result.err);
      }
    } catch (error) {
      console.error('Error agreeing on outcome:', error);
    }
  };

  return (
    <List>
      {bets.map((bet) => (
        <ListItem key={bet.id}>
          <Card className="card-hover" sx={{ width: '100%', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {bet.description}
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Chip label={bet.status} color="primary" variant="outlined" />
                <Chip label={bet.category} color="secondary" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  Created: {new Date(Number(bet.createdAt) / 1000000).toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Creator: {bet.creator}
              </Typography>
              {bet.counterparty && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Accepted by: {bet.counterparty}
                </Typography>
              )}
              {bet.creatorProposedOutcome && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Creator's proposed outcome: {bet.creatorProposedOutcome}
                </Typography>
              )}
              {bet.counterpartyProposedOutcome && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Counterparty's proposed outcome: {bet.counterpartyProposedOutcome}
                </Typography>
              )}
              {bet.finalOutcome && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Final outcome: {bet.finalOutcome}
                </Typography>
              )}
              {bet.smartContractAddress && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Smart Contract: {bet.smartContractAddress}
                </Typography>
              )}
              <Box mt={2}>
                {bet.status === 'Proposed' && (
                  <Button variant="contained" color="primary" onClick={() => handleAcceptBet(bet.id)}>
                    Accept Bet
                  </Button>
                )}
                {(bet.status === 'Accepted' || bet.status === 'OutcomeProposed') && (
                  <Button variant="contained" color="secondary" onClick={() => handleProposeOutcome(bet)}>
                    Propose Outcome
                  </Button>
                )}
                {bet.status === 'OutcomeProposed' && bet.creatorProposedOutcome === bet.counterpartyProposedOutcome && (
                  <Button variant="contained" color="primary" onClick={() => handleAgreeOnOutcome(bet.id)}>
                    Agree on Outcome
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </ListItem>
      ))}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Propose Outcome</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Proposed Outcome"
            type="text"
            fullWidth
            value={proposedOutcome}
            onChange={(e) => setProposedOutcome(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitOutcome} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
};

export default BetList;
