import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';
import BetList from './components/BetList';
import BetForm from './components/BetForm';

interface Bet {
  id: string;
  description: string;
  creator: string;
  outcome: string | null;
  createdAt: bigint;
}

const App: React.FC = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBets();
  }, []);

  const fetchBets = async () => {
    try {
      const fetchedBets = await backend.getBets();
      setBets(fetchedBets);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bets:', error);
      setLoading(false);
    }
  };

  const handleBetCreated = () => {
    fetchBets();
  };

  return (
    <Container maxWidth="md">
      <img
        src="https://images.unsplash.com/photo-1586020969217-9b2296b53ffe?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUyMjk2MzB8&ixlib=rb-4.0.3"
        alt="Future prediction"
        className="header-image"
      />
      <Typography variant="h2" component="h1" gutterBottom>
        Future Bet Creator
      </Typography>
      <BetForm onBetCreated={handleBetCreated} />
      <Box my={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Existing Bets
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : (
          <BetList bets={bets} />
        )}
      </Box>
    </Container>
  );
};

export default App;
