import React, { useState } from 'react';
import { List, ListItem, ListItemText, Paper, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
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
    <Paper elevation={3}>
      <List>
        {bets.map((bet) => (
          <ListItem key={bet.id}>
            <ListItemText
              primary={bet.description}
              secondary={
                <React.Fragment>
                  <Typography component="span" variant="body2" color="textPrimary">
                    Status: {bet.status}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary">
                    Created by: {bet.creator}
                  </Typography>
                  <br />
                  {bet.counterparty && (
                    <Typography component="span" variant="body2" color="textSecondary">
                      Accepted by: {bet.counterparty}
                    </Typography>
                  )}
                  <br />
                  {bet.creatorProposedOutcome && (
                    <Typography component="span" variant="body2" color="textSecondary">
                      Creator's proposed outcome: {bet.creatorProposedOutcome}
                    </Typography>
                  )}
                  {bet.counterpartyProposedOutcome && (
                    <Typography component="span" variant="body2" color="textSecondary">
                      Counterparty's proposed outcome: {bet.counterpartyProposedOutcome}
                    </Typography>
                  )}
                  {bet.finalOutcome && (
                    <Typography component="span" variant="body2" color="textSecondary">
                      Final outcome: {bet.finalOutcome}
                    </Typography>
                  )}
                  <Typography component="span" variant="body2" color="textSecondary">
                    Created at: {new Date(Number(bet.createdAt) / 1000000).toLocaleString()}
                  </Typography>
                  {bet.smartContractAddress && (
                    <>
                      <br />
                      <Typography component="span" variant="body2" color="textSecondary">
                        Smart Contract: {bet.smartContractAddress}
                      </Typography>
                    </>
                  )}
                </React.Fragment>
              }
            />
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
          </ListItem>
        ))}
      </List>
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
    </Paper>
  );
};

export default BetList;
