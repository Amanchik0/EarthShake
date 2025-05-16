import React, { useState } from 'react';
import FilterDropdown from '../../../components/EventList/FilterDropdown';
import CommunityCard from '../../../components/Community/CommunityCard';
import styles from './CommunitiesListPage.module.css';
import { CommunityDetails } from '../../../types/community';

export interface FilterConfig {
  readonly label: string;
  readonly options: FilterOption[];
}

export interface FilterOption {
  readonly value: string;
  readonly label: string;
}

const CommunitiesListPage: React.FC = () => {
  const communities: CommunityDetails[] = [
    {
      id: '1',
      name: 'Клуб любителей походов',
      location: 'Алматы',
      createdAt: '10 января 2025',
      description: 'Группа для любителей активного отдыха и походов в горы.',
      avatarUrl: 'https://example.com/avatar1.jpg',
      coverUrl: 'https://example.com/cover1.jpg',
      imageUrl: 'https://example.com/image2.jpg', 
      numberMembers: 765,
      eventsCount: 23,
      rating: 4.7,
      postsCount: 145,
      isMember: false,
      category: 'active',
    },
    {
      id: '2',
      name: 'Книжный клуб',
      location: 'Астана',
      createdAt: '5 февраля 2025',
      description: 'Сообщество для обсуждения книг и литературы.',
      avatarUrl: 'https://example.com/avatar2.jpg',
      coverUrl: 'https://example.com/cover2.jpg',
      imageUrl: 'https://example.com/image2.jpg', 

      numberMembers: 432,
      eventsCount: 15,
      rating: 4.9,
      postsCount: 278,
      isMember: true,
      category: 'education',
    },
  ];
  const filterConfigs: FilterConfig[] = [
    {
      label: 'category',
      options: [
        { value: '', label: 'Все категории' },
        { value: 'active', label: 'Активный отдых' },
        { value: 'education', label: 'Образование' },
        { value: 'creative', label: 'Творчество' },
        { value: 'tech', label: 'Технологии' },
        { value: 'entertainment', label: 'Развлечения' },
        { value: 'sports', label: 'Спорт' },
      ],
    },
    {
      label: 'location',
      options: [
        { value: '', label: 'Все города' },
        { value: 'Алматы', label: 'Алматы' },
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
        { value: 'small', label: 'До 500 участников' },
        { value: 'medium', label: 'От 500 до 1000' },
        { value: 'large', label: 'Более 1000' },
      ],
    },
  ];

  const [filters, setFilters] = useState<Record<string, string>>({
    category: '',
    location: '',
    size: '',
  });

  const [search, setSearch] = useState('');

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const filteredCommunities = communities.filter(community => {
    // Фильтрация по категории
    if (filters.category && community.category !== filters.category) return false;
    
    // Фильтрация по локации
    if (filters.location && community.location !== filters.location) return false;
    
    // Фильтрация по размеру
    if (filters.size) {
      const count = community.numberMembers;
      
      switch (filters.size) {
        case 'small':
          return count < 500;
        case 'medium':
          return count >= 500 && count < 1000;
        case 'large':
          return count >= 1000;
        default:
          return true;
      }
    }
    
    // Поиск по названию
    if (search && !community.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Сообщества</h1>
        <button className={styles.createButton}>
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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {filterConfigs.map((filter) => (
            <FilterDropdown
              key={filter.label}
              label={filter.label === 'category' ? 'Категория' : 
                    filter.label === 'location' ? 'Город' : 'Размер'}
              options={filter.options}
              value={filters[filter.label] || ''}
              onChange={(value) => handleFilterChange(filter.label, value)}
            />
          ))}
        </div>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.listView}>
          {filteredCommunities.length > 0 ? (
            <div className={styles.communitiesGrid}>
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} />
              ))}
            </div>
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
    </div>
  );
};

export default CommunitiesListPage;