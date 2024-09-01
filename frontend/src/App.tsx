import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, AppBar, Toolbar, Grid } from '@mui/material';
import { backend } from 'declarations/backend';
import BetList from './components/BetList';
import BetForm from './components/BetForm';
import Sidebar from './components/Sidebar';

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

const App: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  const filteredBets = selectedCategory
    ? bets.filter((bet) => bet.category === selectedCategory)
    : bets;

  return (
    <>
      <AppBar position="static" className="gradient-bg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Future Bet Creator
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Sidebar onCategorySelect={setSelectedCategory} />
          </Grid>
          <Grid item xs={12} md={9}>
            <Box mt={4}>
              <BetForm onBetCreated={handleBetCreated} />
              <Box my={4}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {selectedCategory ? `${selectedCategory} Bets` : 'All Bets'}
                </Typography>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <BetList bets={filteredBets} onBetUpdated={fetchBets} />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
