import React from 'react';
import { Box, Button } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import MapIcon from '@mui/icons-material/Map';

interface ViewModeToggleProps {
  viewMode: 'list' | 'map';
  setViewMode: (mode: 'list' | 'map') => void;
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ viewMode, setViewMode }) => {
  const handleToggle = (mode: 'list' | 'map') => () => {
    if (mode !== viewMode) {
      setViewMode(mode);
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        width: 120,
        height: 40,
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          bgcolor: 'primary.main',
          transition: 'transform 0.3s ease',
          transform: viewMode === 'list' ? 'translateX(0%)' : 'translateX(100%)',
        }}
      />
      <Button
        onClick={handleToggle('list')}
        sx={{
          flex: 1,
          zIndex: 1,
          color: viewMode === 'list' ? 'white' : 'black',
          minWidth: 0,
        }}
      >
        <ListIcon />
      </Button>
      <Button
        onClick={handleToggle('map')}
        sx={{
          flex: 1,
          zIndex: 1,
          color: viewMode === 'map' ? 'white' : 'black',
          minWidth: 0,
        }}
      >
        <MapIcon />
      </Button>
    </Box>
  );
};

export default ViewModeToggle;
