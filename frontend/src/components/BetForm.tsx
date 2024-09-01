import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress } from '@mui/material';
import { backend } from 'declarations/backend';

interface BetFormProps {
  onBetCreated: () => void;
}

const BetForm: React.FC<BetFormProps> = ({ onBetCreated }) => {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: { description: string; creator: string }) => {
    try {
      const result = await backend.createBet(data.description, data.creator);
      if ('ok' in result) {
        console.log('Bet created with ID:', result.ok);
        reset();
        onBetCreated();
      } else {
        console.error('Error creating bet:', result.err);
      }
    } catch (error) {
      console.error('Error creating bet:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Controller
          name="description"
          control={control}
          defaultValue=""
          rules={{ required: 'Description is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Bet Description"
              variant="outlined"
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="creator"
          control={control}
          defaultValue=""
          rules={{ required: 'Creator name is required' }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Your Name"
              variant="outlined"
              fullWidth
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
        >
          Create Bet
        </Button>
      </Box>
    </form>
  );
};

export default BetForm;
