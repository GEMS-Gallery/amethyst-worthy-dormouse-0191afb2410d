import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography, Button } from '@mui/material';
import { backend } from 'declarations/backend';

interface Bet {
  id: string;
  description: string;
  creator: string;
  counterparty: string | null;
  outcome: string | null;
  createdAt: bigint;
  status: string;
  smartContractAddress: string | null;
}

interface BetListProps {
  bets: Bet[];
  onBetAccepted: () => void;
}

const BetList: React.FC<BetListProps> = ({ bets, onBetAccepted }) => {
  const handleAcceptBet = async (betId: string) => {
    try {
      const result = await backend.acceptBet(betId);
      if ('ok' in result) {
        console.log('Bet accepted:', result.ok);
        onBetAccepted();
      } else {
        console.error('Error accepting bet:', result.err);
      }
    } catch (error) {
      console.error('Error accepting bet:', error);
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
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BetList;
