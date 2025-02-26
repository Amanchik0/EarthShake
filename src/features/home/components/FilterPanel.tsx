import React from 'react';
import { Drawer, Box, Typography, TextField, Button } from '@mui/material';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ open, onClose }) => {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 300, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Фильтр
        </Typography>
        <TextField label="Цена от" fullWidth margin="normal" />
        <TextField label="Цена до" fullWidth margin="normal" />
        <TextField label="Комнат" fullWidth margin="normal" />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Применить
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterPanel;
