import React, { useState, useEffect } from 'react';
import { Container, Box } from '@mui/material';
import SearchBar from './components/SearchBar';
import ViewModeToggle from './components/ViewModeToggle';
import DataList, { DataItem } from './components/DataList';
import DataMap from './components/DataMap';

// Пример данных (можно заменить на запрос с бэкенда или импортировать JSON)
const initialData: DataItem[] = [
  { id: 1, name: 'Объект 1' },
  { id: 2, name: 'Объект 2' },
  { id: 3, name: 'Объект 3' },
];

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filteredData, setFilteredData] = useState<DataItem[]>(initialData);

  // Фильтрация данных по введённому запросу
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
      {/* Верхняя панель с поиском и переключателем */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
      </Box>

      {/* Отображение списка или карты */}
      {viewMode === 'list' ? <DataList data={filteredData} /> : <DataMap />}
    </Container>
  );
};

export default HomePage;
