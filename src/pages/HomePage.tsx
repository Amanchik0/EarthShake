import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import SearchBar from '../features/home/SearchBar';
import ViewModeToggle from '../features/home/ViewModeToggle';
import DataList from '../features/home/DataList';
import DataMap from '../features/home/DataMap';
import { DataItem } from '../features/home/DataItem';

const initialData: DataItem[] = [
  { id: 1, name: 'Объект 1', description: 'Описание объекта 1', date: '2025-05-10', location: 'somewher' },
  { id: 2, name: 'Объект 2s', description: 'Описание объекта 2', date: '2025-06-15', location: 'almaty' },
  { id: 3, name: 'Объект 3', description: 'Описание объекта 3', date: '2025-07-20', location: 'paradise' },
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

