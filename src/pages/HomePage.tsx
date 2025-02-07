import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import SearchBar from '../features/home/components/SearchBar';
import ViewModeToggle from '../features/home/components/ViewModeToggle';
import DataList, { DataItem } from '../features/home/components/DataList';
import DataMap from '../features/home/components/DataMap';

const initialData: DataItem[] = [
  { id: 1, name: 'Объект 1' },
  { id: 2, name: 'Объект 2' },
  { id: 3, name: 'Объект 3' },
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filteredData, setFilteredData] = useState<DataItem[]>(initialData);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(initialData);
    } else {
      setFilteredData(
        initialData.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </Box>

      {viewMode === 'list' ? <DataList data={filteredData} /> : <DataMap />}
    </Container>
  );
};

export default HomePage;

