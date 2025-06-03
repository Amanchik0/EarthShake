import React, { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/LocalOffer';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import styles from './NewsListPage.module.css';

// Типы данных для API ответа
interface ApiNewsItem {
  title: string;
  link: string;
  pubDate: string;
  keywords: string[] | null;
  description: string | null;
  content: string;
  image_url: string | null;
  video_url: string | null;
  source_icon: string | null;
  source_name: string;
}

// Адаптированные типы для компонента
interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  imageUrl: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  date: string;
  category: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isBookmarked: boolean;
  link: string;
}

interface NewsFilterState {
  searchQuery: string;
  category: string;
  dateRange: string;
}

const CATEGORIES = [
  { id: 'all', name: 'Все категории' },
  { id: 'tech', name: 'Технологии' },
  { id: 'creative', name: 'Творчество' },
  { id: 'education', name: 'Образование' },
  { id: 'sports', name: 'Спорт' },
  { id: 'entertainment', name: 'Развлечения' },
  { id: 'active', name: 'Активности' },
];

const DATE_RANGES = [
  { id: 'all', name: 'За все время' },
  { id: 'today', name: 'За сегодня' },
  { id: 'week', name: 'За неделю' },
  { id: 'month', name: 'За месяц' },
  { id: 'year', name: 'За год' },
];

// Функция для определения категории на основе ключевых слов и контента
const determineCategory = (item: ApiNewsItem): string => {
  const title = item.title?.toLowerCase() || '';
  const description = item.description?.toLowerCase() || '';
  const keywords = item.keywords?.join(' ').toLowerCase() || '';
  const content = `${title} ${description} ${keywords}`;

  if (content.includes('спорт') || content.includes('футбол') || content.includes('теннис') || 
      content.includes('олимп') || content.includes('чемпион')) {
    return 'sports';
  }
  if (content.includes('технолог') || content.includes('ит') || content.includes('цифров') || 
      content.includes('интернет') || content.includes('компьютер')) {
    return 'tech';
  }
  if (content.includes('образован') || content.includes('школ') || content.includes('универ') || 
      content.includes('студент') || content.includes('учеб')) {
    return 'education';
  }
  if (content.includes('искусств') || content.includes('культур') || content.includes('творч') || 
      content.includes('выставк') || content.includes('театр') || content.includes('музей')) {
    return 'creative';
  }
  if (content.includes('развлеч') || content.includes('кино') || content.includes('фильм') || 
      content.includes('шоу') || content.includes('концерт')) {
    return 'entertainment';
  }
  return 'active'; // по умолчанию для новостей общего характера
};

// Функция для извлечения тегов из ключевых слов и контента
const extractTags = (item: ApiNewsItem): string[] => {
  const tags: string[] = [];
  
  if (item.keywords) {
    tags.push(...item.keywords.filter(keyword => keyword !== 'новости'));
  }
  
  // Добавляем источник как тег
  if (item.source_name) {
    tags.push(item.source_name);
  }
  
  return tags.slice(0, 3); // ограничиваем до 3 тегов
};

// Функция для преобразования API данных в формат компонента
const transformApiDataToNewsItems = (apiData: ApiNewsItem[][]): NewsItem[] => {
  const flatData = apiData.flat();
  
  return flatData.map((item, index) => ({
    id: index + 1,
    title: item.title,
    excerpt: item.description || 'Описание недоступно',
    imageUrl: item.image_url || '/api/placeholder/400/200',
    author: {
      name: item.source_name || 'Неизвестный автор',
      avatarUrl: item.source_icon || '/api/placeholder/40/40',
    },
    date: item.pubDate,
    category: determineCategory(item),
    tags: extractTags(item),
    viewCount: Math.floor(Math.random() * 2000) + 100, // случайные значения
    likeCount: Math.floor(Math.random() * 500) + 10,
    commentCount: Math.floor(Math.random() * 100) + 1,
    isBookmarked: Math.random() > 0.7, // 30% вероятность быть в закладках
    link: item.link,
  }));
};

const NewsListPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filters, setFilters] = useState<NewsFilterState>({
    searchQuery: '',
    category: 'all',
    dateRange: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных с API
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('http://localhost:8090/api/news');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ApiNewsItem[][] = await response.json();
        const transformedNews = transformApiDataToNewsItems(data);
        setNewsItems(transformedNews);
        
      } catch (err) {
        console.error('Ошибка при загрузке новостей:', err);
        setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  // Функция фильтрации новостей
  const getFilteredNews = () => {
    return newsItems.filter(item => {
      // Фильтр по поисковому запросу
      const matchesQuery = item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // Фильтр по категории
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      
      // Фильтр по дате
      let matchesDate = true;
      const itemDate = new Date(item.date);
      const now = new Date();
      
      if (filters.dateRange === 'today') {
        matchesDate = itemDate.toDateString() === now.toDateString();
      } else if (filters.dateRange === 'week') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        matchesDate = itemDate >= oneWeekAgo;
      } else if (filters.dateRange === 'month') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        matchesDate = itemDate >= oneMonthAgo;
      } else if (filters.dateRange === 'year') {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        matchesDate = itemDate >= oneYearAgo;
      }
      
      return matchesQuery && matchesCategory && matchesDate;
    });
  };

  const filteredNews = getFilteredNews();

  // Обработчики изменения фильтров
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const handleDateRangeChange = (dateRange: string) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Обработчик клика "Читать далее"
  const handleReadMore = (newsItem: NewsItem) => {
    if (newsItem.link) {
      window.open(newsItem.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Новости и события</h1>
      </div>
      
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Поиск новостей..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <TagIcon fontSize="small" />
              <span>Категория</span>
            </div>
            <div className={styles.filterOptions}>
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  className={`${styles.filterButton} ${filters.category === category.id ? styles.active : ''}`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))} 
            </div>
          </div>
          

        </div>
      </div>
      
      <div className={styles.newsListContainer}>
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка новостей...</p>
          </div>
        ) : error ? (
          <div className={styles.noResults}>
            <SearchIcon style={{ fontSize: 48 }} />
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button 
              className={styles.readMoreButton}
              onClick={() => window.location.reload()}
            >
              Попробовать снова
            </button>
          </div>
        ) : filteredNews.length > 0 ? (
          <div className={styles.newsList}>
            {filteredNews.map(news => (
              <div key={news.id} className={styles.newsCard}>
                <div className={styles.newsImageContainer}>
                  <div 
                    className={styles.newsImage} 
                    style={{ 
                      backgroundImage: `url(${news.imageUrl})`,
                      backgroundColor: '#f0f0f0'
                    }} 
                  />
                  <div className={styles.categoryBadge}>
                    <span className={`${styles.tag} ${styles[news.category]}`}>
                      {CATEGORIES.find(cat => cat.id === news.category)?.name}
                    </span>
                  </div>
                </div>
                
                <div className={styles.newsContent}>
                  <h2 className={styles.newsTitle}>{news.title}</h2>
                  
                  <div className={styles.newsInfo}>
                    <div className={styles.authorInfo}>
                      <div className={styles.authorAvatar}>
                        <img 
                          src={news.author.avatarUrl} 
                          alt={news.author.name}
                          onError={(e) => {
                            e.currentTarget.src = '/api/placeholder/40/40';
                          }}
                        />
                      </div>
                      <span className={styles.authorName}>{news.author.name}</span>
                    </div>
                    <div className={styles.dateInfo}>
                      <CalendarTodayIcon fontSize="small" />
                      <span>{formatDate(news.date)}</span>
                    </div>
                  </div>
                  
                  <p className={styles.newsExcerpt}>{news.excerpt}</p>
                  
                  <div className={styles.tagList}>
                    {news.tags.map((tag, index) => (
                      <span key={index} className={styles.newsTag}>#{tag}</span>
                    ))}
                  </div>
                  
                  <div className={styles.newsFooter}>
                    <div className={styles.newsStats}>
                      <div className={styles.stat}>
                        <VisibilityIcon fontSize="small" />
                        <span>{news.viewCount}</span>
                      </div>
                      <div className={styles.stat}>
                        {news.isBookmarked ? (
                          <FavoriteIcon fontSize="small" style={{ color: "#ff69b4" }} />
                        ) : (
                          <FavoriteBorderIcon fontSize="small" />
                        )}
                        <span>{news.likeCount}</span>
                      </div>
                      <div className={styles.stat}>
                        <ChatBubbleOutlineIcon fontSize="small" />
                        <span>{news.commentCount}</span>
                      </div>
                    </div>
                    
                    <button 
                      className={styles.readMoreButton}
                      onClick={() => handleReadMore(news)}
                    >
                      Читать далее
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <SearchIcon style={{ fontSize: 48 }} />
            <h3>Новости не найдены</h3>
            <p>Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsListPage;