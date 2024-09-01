import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, CircularProgress, Card, CardContent, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { backend } from 'declarations/backend';

interface BetFormProps {
  onBetCreated: () => void;
}

const BetForm: React.FC<BetFormProps> = ({ onBetCreated }) => {
  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data: { description: string; category: string }) => {
    try {
      const result = await backend.proposeBet(data.description, data.category);
      if ('ok' in result) {
        console.log('Bet proposed with ID:', result.ok);
        reset();
        onBetCreated();
      } else {
        console.error('Error proposing bet:', result.err);
      }
    } catch (error) {
      console.error('Error proposing bet:', error);
    }
  };

  return (
    <Card className="card-hover" sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Create a New Bet
        </Typography>
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
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: 'Category is required' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel id="category-label">Category</InputLabel>
                  <Select
                    {...field}
                    labelId="category-label"
                    label="Category"
                  >
                    <MenuItem value="sports">Sports</MenuItem>
                    <MenuItem value="politics">Politics</MenuItem>
                    <MenuItem value="entertainment">Entertainment</MenuItem>
                    <MenuItem value="technology">Technology</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                  {error && <Typography color="error">{error.message}</Typography>}
                </FormControl>
              )}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Propose Bet
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default BetForm;
