import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterDropdown from '../../../components/EventList/FilterDropdown';
import CommunityCard from '../../../components/Community/CommunityCard';
import { useCommunitiesList } from '../../../hooks/useCommunityApi';
import styles from './CommunitiesListPage.module.css';

export interface FilterConfig {
  readonly label: string;
  readonly options: FilterOption[];
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

const CommunitiesListPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    communities, 
    loading, 
    error, 
    pagination,
    fetchCommunities, 
    loadMore, 
    searchCommunities 
  } = useCommunitiesList();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    type: '',
    city: '',
    size: '',
  });
  const [localFilteredCommunities, setLocalFilteredCommunities] = useState(communities);

  const filterConfigs: FilterConfig[] = [
    {
      label: 'type',
      options: [
        { value: '', label: 'Все категории' },
        { value: 'hobby', label: 'Хобби' },
        { value: 'technology', label: 'Технологии' },
        { value: 'arts', label: 'Искусство и культура' },
        { value: 'sports', label: 'Спорт' },
        { value: 'education', label: 'Образование' },
        { value: 'social', label: 'Социальные' },
        { value: 'business', label: 'Бизнес' },
        { value: 'other', label: 'Другое' },
      ],
    },
    {
      label: 'city',
      options: [
        { value: '', label: 'Все города' },
        { value: 'Алматы', label: 'Алматы' },
        { value: 'Almaty', label: 'Almaty' },
        { value: 'Астана', label: 'Астана' },
        { value: 'Шымкент', label: 'Шымкент' },
        { value: 'Караганда', label: 'Караганда' },
        { value: 'Онлайн', label: 'Онлайн' },
      ],
    },
    {
      label: 'size',
      options: [
        { value: '', label: 'Любой размер' },
        { value: 'small', label: 'До 50 участников' },
        { value: 'medium', label: 'От 50 до 500' },
        { value: 'large', label: 'Более 500' },
      ],
    },
  ];

  // Загружаем сообщества при монтировании компонента
  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  // Локальная фильтрация (поскольку API может не поддерживать все фильтры)
  useEffect(() => {
    let filtered = communities;

    // Фильтрация по типу/категории
    if (filters.type) {
      filtered = filtered.filter(community => community.category === filters.type);
    }

    // Фильтрация по городу
    if (filters.city) {
      filtered = filtered.filter(community => 
        community.location.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Фильтрация по размеру
    if (filters.size) {
      const count = (community: any) => community.numberMembers;
      
      switch (filters.size) {
        case 'small':
          filtered = filtered.filter(community => count(community) < 50);
          break;
        case 'medium':
          filtered = filtered.filter(community => count(community) >= 50 && count(community) < 500);
          break;
        case 'large':
          filtered = filtered.filter(community => count(community) >= 500);
          break;
      }
    }

    // Поиск по названию
    if (search.trim()) {
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(search.toLowerCase()) ||
        community.description.toString().toLowerCase().includes(search.toLowerCase())
      );
    }

    setLocalFilteredCommunities(filtered);
  }, [communities, filters, search]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    // Можно добавить debounced поиск через API
    // searchCommunities(value, filters);
  };

  const handleCreateCommunity = () => {
    navigate('/communities/create');
  };

  const handleLoadMore = async () => {
    if (pagination.hasMore && !loading) {
      await loadMore();
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка загрузки</h2>
          <p>{error}</p>
          <button onClick={() => fetchCommunities()}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Сообщества</h1>
        <button className={styles.createButton} onClick={handleCreateCommunity}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Создать сообщество
        </button>
      </div>
      
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            placeholder="Поиск сообществ..." 
            className={styles.searchInput}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {filterConfigs.map((filter) => (
            <FilterDropdown
              key={filter.label}
              label={filter.label === 'type' ? 'Категория' : 
                    filter.label === 'city' ? 'Город' : 'Размер'}
              options={filter.options}
              value={filters[filter.label] || ''}
              onChange={(value) => handleFilterChange(filter.label, value)}
            />
          ))}
        </div>
      </div>

      <div className={styles.statsSection}>
        <p className={styles.resultsCount}>
          {loading ? 'Загрузка...' : `Найдено ${localFilteredCommunities.length} из ${pagination.totalElements} сообществ`}
        </p>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.listView}>
          {localFilteredCommunities.length > 0 ? (
            <>
              <div className={styles.communitiesGrid}>
                {localFilteredCommunities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
              </div>
              
              {/* Кнопка "Загрузить еще" */}
              {pagination.hasMore && !search && Object.values(filters).every(f => !f) && (
                <div className={styles.loadMoreSection}>
                  <button 
                    className={styles.loadMoreButton}
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Загрузка...' : 'Загрузить еще'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noResults}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="8" y1="15" x2="16" y2="15"></line>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              <p>Сообществ не найдено</p>
              <p>Попробуйте изменить параметры поиска</p>
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && communities.length === 0 && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Загрузка сообществ...</p>
        </div>
      )}
    </div>
  );
};

export default CommunitiesListPage;