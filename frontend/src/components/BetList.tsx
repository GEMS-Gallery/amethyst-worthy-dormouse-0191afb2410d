import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

interface Bet {
  id: string;
  description: string;
  creator: string;
  outcome: string | null;
  createdAt: bigint;
}

interface BetListProps {
  bets: Bet[];
}

const BetList: React.FC<BetListProps> = ({ bets }) => {
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
                    Created by: {bet.creator}
                  </Typography>
                  <br />
                  <Typography component="span" variant="body2" color="textSecondary">
                    Created at: {new Date(Number(bet.createdAt) / 1000000).toLocaleString()}
                  </Typography>
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default BetList;
