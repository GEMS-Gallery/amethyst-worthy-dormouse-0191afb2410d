import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, AppBar, Toolbar } from '@mui/material';
import { backend } from 'declarations/backend';
import BetList from './components/BetList';
import BetForm from './components/BetForm';

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

const App: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const fetchedBets = await backend.getAllBets();
      setBets(fetchedBets.map(convertBet));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bets:', error);
      setLoading(false);
    }
  };

  const convertBet = (bet: any): Bet => ({
    ...bet,
    creator: bet.creator.toString(),
    counterparty: bet.counterparty ? bet.counterparty.toString() : null,
    createdAt: BigInt(bet.createdAt),
    status: bet.status.toString(),
  });

  const handleBetCreated = () => {
    fetchBets();
  };

  return (
    <>
      <AppBar position="static" className="gradient-bg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Future Bet Creator
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box mt={4}>
          <BetForm onBetCreated={handleBetCreated} />
          <Box my={4}>
            <Typography variant="h4" component="h2" gutterBottom>
              Existing Bets
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : (
              <BetList bets={bets} onBetUpdated={fetchBets} />
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default App;
