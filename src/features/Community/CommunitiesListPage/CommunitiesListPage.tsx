import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../components/auth/AuthContext';
import FilterDropdown from '../../../components/EventList/FilterDropdown';
import CommunityCard from '../../../components/Community/CommunityCard';
import SubscriptionCheckModal from '../../../components/Modal/SubscriptionCheckModal';
import { useSubscriptionCheck } from '../../../hooks/useSubscriptionCheck';
import styles from './CommunitiesListPage.module.css';
import { Community, CommunityDetails, toCommunityDetails } from '../../../types/community';

// Интерфейс для ответа API с пагинацией
interface CommunityPageResponse {
  content: Community[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

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
  const { user } = useAuth();
  const { isModalOpen, pendingNavigation, checkSubscriptionAndNavigate, closeModal } = useSubscriptionCheck();

  // Состояния для данных
  const [communities, setCommunities] = useState<CommunityDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Состояния для фильтров и поиска
  const [filters, setFilters] = useState<Record<string, string>>({
    category: '',
    location: '',
    size: '',
    membership: '',
  });
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'rating' | 'created'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
        { value: 'business', label: 'Бизнес' },
        { value: 'science', label: 'Наука' },
        { value: 'health', label: 'Здоровье' },
        { value: 'art', label: 'Искусство' },
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
        { value: 'Актобе', label: 'Актобе' },
        { value: 'Тараз', label: 'Тараз' },
        { value: 'Павлодар', label: 'Павлодар' },
        { value: 'Усть-Каменогорск', label: 'Усть-Каменогорск' },
        { value: 'Семей', label: 'Семей' },
        { value: 'Атырау', label: 'Атырау' },
        { value: 'Костанай', label: 'Костанай' },
        { value: 'Кызылорда', label: 'Кызылорда' },
        { value: 'Уральск', label: 'Уральск' },
        { value: 'Петропавловск', label: 'Петропавловск' },
        { value: 'Актау', label: 'Актау' },
        { value: 'Темиртау', label: 'Темиртау' },
        { value: 'Туркестан', label: 'Туркестан' },
        { value: 'Онлайн', label: 'Онлайн' },
      ],
    },
    {
      label: 'size',
      options: [
        { value: '', label: 'Любой размер' },
        { value: 'small', label: 'До 100 участников' },
        { value: 'medium', label: 'От 100 до 500' },
        { value: 'large', label: 'От 500 до 1000' },
        { value: 'huge', label: 'Более 1000' },
      ],
    },
    {
      label: 'membership',
      options: [
        { value: '', label: 'Все сообщества' },
        { value: 'member', label: 'Мои сообщества' },
        { value: 'author', label: 'Созданные мной' },
        { value: 'available', label: 'Доступные для вступления' },
      ],
    },
  ];

  // Функция загрузки сообществ
  const loadCommunities = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(' Загружаем список сообществ...');
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8090/api/community/get-all', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка загрузки сообществ:', response.status, errorText);
        throw new Error(`Ошибка ${response.status}: ${errorText}`);
      }

      const data: CommunityPageResponse = await response.json();
      console.log(' Ответ API сообществ:', data);
      console.log(` Найдено ${data.totalElements} сообществ на ${data.totalPages} страницах`);

      // Извлекаем массив сообществ из поля content
      const communitiesArray: Community[] = data.content || [];
      console.log(' Массив сообществ:', communitiesArray);

      if (!Array.isArray(communitiesArray)) {
        throw new Error('Некорректный формат данных от сервера');
      }

      // Преобразуем в CommunityDetails
      const communityDetails = communitiesArray.map(community => 
        toCommunityDetails(community, user?.username)
      );

      console.log(` Обработано ${communityDetails.length} сообществ`);
      setCommunities(communityDetails);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.error('Ошибка загрузки сообществ:', errorMessage);
      setError(errorMessage);
      setCommunities([]);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка сообществ при монтировании
  useEffect(() => {
    loadCommunities();
  }, [user?.username]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    // Автоматически применяем фильтр по городу
    if (cityName) {
      setFilters(prev => ({ ...prev, location: cityName }));
    }
  };

  // Обработчик создания сообщества с проверкой подписки
  const handleCreateCommunity = () => {
    checkSubscriptionAndNavigate('community', '/communities/create', navigate);
  };

  const handleSort = (field: 'name' | 'members' | 'rating' | 'created') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Фильтрация и сортировка сообществ
  const filteredAndSortedCommunities = communities
    .filter(community => {
      // Фильтрация по категории
      if (filters.category && community.category !== filters.category) return false;
      
      // Фильтрация по локации
      if (filters.location && community.city !== filters.location) return false;
      
      // Фильтрация по размеру
      if (filters.size) {
        const count = community.numberMembers;
        
        switch (filters.size) {
          case 'small':
            return count < 100;
          case 'medium':
            return count >= 100 && count < 500;
          case 'large':
            return count >= 500 && count < 1000;
          case 'huge':
            return count >= 1000;
          default:
            return true;
        }
      }

      // Фильтрация по участию
      if (filters.membership) {
        switch (filters.membership) {
          case 'member':
            return community.isMember;
          case 'author':
            return community.isAuthor;
          case 'available':
            return !community.isMember;
          default:
            return true;
        }
      }
      
      // Поиск по названию и описанию
      if (search) {
        const searchLower = search.toLowerCase();
        return community.name.toLowerCase().includes(searchLower) ||
               community.description.toLowerCase().includes(searchLower) ||
               community.city.toLowerCase().includes(searchLower);
      }
      
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'members':
          comparison = a.numberMembers - b.numberMembers;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Показываем состояние загрузки
  if (loading && communities.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка сообществ...</p>
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

      {/* Ошибка загрузки */}
      {error && (
        <div className={styles.errorBanner}>
          <div className={styles.errorContent}>
            <span>{error}</span>
            <div className={styles.errorActions}>
              <button onClick={clearError} className={styles.closeError}>✕</button>
              <button onClick={loadCommunities} className={styles.retryButton}>
                Повторить
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.filterSection}>
        {/* Поиск */}
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

        {/* Фильтры */}
        <div className={styles.filters}>
          {filterConfigs.map((filter) => (
            <FilterDropdown
              key={filter.label}
              label={filter.label === 'category' ? 'Категория' : 
                    filter.label === 'location' ? 'Город' : 
                    filter.label === 'size' ? 'Размер' : 'Участие'}
              options={filter.options}
              value={filters[filter.label] || ''}
              onChange={(value) => handleFilterChange(filter.label, value)}
            />
          ))}
        </div>

        {/* Сортировка */}
        <div className={styles.sortSection}>
          <span className={styles.sortLabel}>Сортировка:</span>
          <div className={styles.sortButtons}>
            {[
              { key: 'name', label: 'По названию' },
              { key: 'members', label: 'По участникам' },
              { key: 'rating', label: 'По рейтингу' },
              { key: 'created', label: 'По дате создания' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSort(key as any)}
                className={`${styles.sortButton} ${sortBy === key ? styles.active : ''}`}
              >
                {label}
                {sortBy === key && (
                  <span className={styles.sortIcon}>
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className={styles.contentWrapper}>
        <div className={styles.listView}>
          {/* Статистика */}
          <div className={styles.statsBar}>
            <span className={styles.resultsCount}>
              {filteredAndSortedCommunities.length} из {communities.length} сообществ
            </span>
            {loading && (
              <span className={styles.loadingIndicator}>
                <div className={styles.miniSpinner}></div>
                Обновление...
              </span>
            )}
          </div>

          {/* Список сообществ */}
          {filteredAndSortedCommunities.length > 0 ? (
            <div className={styles.communitiesGrid}>
              {filteredAndSortedCommunities.map((community) => (
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
              <p>
                {search || Object.values(filters).some(f => f) 
                  ? 'Сообществ не найдено' 
                  : 'Сообщества еще не созданы'
                }
              </p>
              <p>
                {search || Object.values(filters).some(f => f)
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Станьте первым, кто создаст сообщество!'
                }
              </p>
              {!search && !Object.values(filters).some(f => f) && (
                <button 
                  onClick={handleCreateCommunity}
                  className={styles.createFirstButton}
                >
                  Создать первое сообщество
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно проверки подписки */}
      {pendingNavigation && (
        <SubscriptionCheckModal
          isOpen={isModalOpen}
          onClose={closeModal}
          feature={pendingNavigation.feature}
          targetPath={pendingNavigation.targetPath}
        />
      )}
    </div>
  );
};

export default CommunitiesListPage;