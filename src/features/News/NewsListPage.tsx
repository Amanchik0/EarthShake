import React, { useState, useEffect } from 'react';
// Заменяем react-icons/fi на @mui/icons-material
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TagIcon from '@mui/icons-material/LocalOffer';
import GroupIcon from '@mui/icons-material/Group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import styles from './NewsListPage.module.css';

// Типы данных
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
}

interface NewsFilterState {
  searchQuery: string;
  category: string;
  dateRange: string;
}

// Моковые данные для примера
const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: 'Новый прорыв в технологии искусственного интеллекта',
    excerpt: 'Ученые объявили о значительном прогрессе в разработке систем искусственного интеллекта, способных к глубокому пониманию контекста...',
    imageUrl: 'https://example.com/news1.jpg',
    author: {
      name: 'Анна Петрова',
      avatarUrl: 'https://example.com/avatar1.jpg',
    },
    date: '2025-05-15',
    category: 'tech',
    tags: ['AI', 'технологии', 'наука'],
    viewCount: 1245,
    likeCount: 342,
    commentCount: 56,
    isBookmarked: false,
  },
  {
    id: 2,
    title: 'Международный фестиваль искусств объявил программу на следующий год',
    excerpt: 'Организаторы одного из крупнейших фестивалей искусств представили программу мероприятий на следующий год...',
    imageUrl: 'https://example.com/news2.jpg',
    author: {
      name: 'Михаил Сидоров',
      avatarUrl: 'https://example.com/avatar2.jpg',
    },
    date: '2025-05-14',
    category: 'creative',
    tags: ['искусство', 'фестиваль', 'культура'],
    viewCount: 895,
    likeCount: 210,
    commentCount: 32,
    isBookmarked: true,
  },
  {
    id: 3,
    title: 'Новые методы обучения показали высокую эффективность',
    excerpt: 'Исследование, проведенное международной группой педагогов, выявило новые подходы к образованию...',
    imageUrl: 'https://example.com/news3.jpg',
    author: {
      name: 'Елена Иванова',
      avatarUrl: 'https://example.com/avatar3.jpg',
    },
    date: '2025-05-13',
    category: 'education',
    tags: ['образование', 'исследование', 'методика'],
    viewCount: 1056,
    likeCount: 286,
    commentCount: 41,
    isBookmarked: false,
  },
  {
    id: 4,
    title: 'Обзор новых спортивных событий сезона',
    excerpt: 'Предстоящий спортивный сезон обещает быть насыщенным событиями. Мы подготовили обзор...',
    imageUrl: 'https://example.com/news4.jpg',
    author: {
      name: 'Алексей Смирнов',
      avatarUrl: 'https://example.com/avatar4.jpg',
    },
    date: '2025-05-12',
    category: 'sports',
    tags: ['спорт', 'соревнования', 'обзор'],
    viewCount: 782,
    likeCount: 195,
    commentCount: 28,
    isBookmarked: false,
  },
  {
    id: 5,
    title: 'Премьеры месяца: что посмотреть в кинотеатрах',
    excerpt: 'В этом месяце на большие экраны выходят несколько долгожданных премьер. Мы составили список...',
    imageUrl: 'https://example.com/news5.jpg',
    author: {
      name: 'Ольга Козлова',
      avatarUrl: 'https://example.com/avatar5.jpg',
    },
    date: '2025-05-11',
    category: 'entertainment',
    tags: ['кино', 'премьеры', 'развлечения'],
    viewCount: 1345,
    likeCount: 312,
    commentCount: 62,
    isBookmarked: true,
  },
  {
    id: 6,
    title: 'Экологические инициативы набирают популярность',
    excerpt: 'Всё больше компаний внедряют экологические практики в свою деятельность. Эксперты отмечают...',
    imageUrl: 'https://example.com/news6.jpg',
    author: {
      name: 'Дмитрий Соколов',
      avatarUrl: 'https://example.com/avatar6.jpg',
    },
    date: '2025-05-10',
    category: 'active',
    tags: ['экология', 'устойчивое развитие', 'инициативы'],
    viewCount: 964,
    likeCount: 275,
    commentCount: 38,
    isBookmarked: false,
  },
  {
    id: 7,
    title: 'Новые тенденции в области информационной безопасности',
    excerpt: 'Специалисты по кибербезопасности выделили ключевые тренды, которые будут определять развитие отрасли...',
    imageUrl: 'https://example.com/news7.jpg',
    author: {
      name: 'Сергей Волков',
      avatarUrl: 'https://example.com/avatar7.jpg',
    },
    date: '2025-05-09',
    category: 'tech',
    tags: ['кибербезопасность', 'технологии', 'тренды'],
    viewCount: 1125,
    likeCount: 298,
    commentCount: 47,
    isBookmarked: false,
  },
  {
    id: 8,
    title: 'Галерея современного искусства анонсировала новую выставку',
    excerpt: 'Одна из ведущих галерей готовит масштабную выставку работ молодых художников. Куратор проекта рассказал...',
    imageUrl: 'https://example.com/news8.jpg',
    author: {
      name: 'Наталия Морозова',
      avatarUrl: 'https://example.com/avatar8.jpg',
    },
    date: '2025-05-08',
    category: 'creative',
    tags: ['искусство', 'выставка', 'галерея'],
    viewCount: 735,
    likeCount: 186,
    commentCount: 25,
    isBookmarked: true,
  },
  {
    id: 9,
    title: 'Результаты международной олимпиады по программированию',
    excerpt: 'Завершилась престижная международная олимпиада по программированию. Команды из разных стран показали высокие результаты...',
    imageUrl: 'https://example.com/news9.jpg',
    author: {
      name: 'Игорь Белов',
      avatarUrl: 'https://example.com/avatar9.jpg',
    },
    date: '2025-05-07',
    category: 'education',
    tags: ['программирование', 'олимпиада', 'образование'],
    viewCount: 968,
    likeCount: 254,
    commentCount: 36,
    isBookmarked: false,
  },
  {
    id: 10,
    title: 'Инновации в индустрии развлечений: виртуальная реальность',
    excerpt: 'Технологии виртуальной реальности меняют индустрию развлечений. Новые проекты и решения...',
    imageUrl: 'https://example.com/news10.jpg',
    author: {
      name: 'Мария Лебедева',
      avatarUrl: 'https://example.com/avatar10.jpg',
    },
    date: '2025-05-06',
    category: 'entertainment',
    tags: ['VR', 'развлечения', 'технологии'],
    viewCount: 1089,
    likeCount: 267,
    commentCount: 42,
    isBookmarked: false,
  },
];

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

const NewsListPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [filters, setFilters] = useState<NewsFilterState>({
    searchQuery: '',
    category: 'all',
    dateRange: 'all',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Имитация загрузки данных с сервера
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Имитация задержки сети
      await new Promise(resolve => setTimeout(resolve, 800));
      setNewsItems(MOCK_NEWS);
      setIsLoading(false);
    };
    
    fetchData();
  }, []);

  // Функция фильтрации новостей
  const getFilteredNews = () => {
    return newsItems.filter(item => {
      // Фильтр по поисковому запросу
      const matchesQuery = item.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) || 
                          item.excerpt.toLowerCase().includes(filters.searchQuery.toLowerCase());
      
      // Фильтр по категории
      const matchesCategory = filters.category === 'all' || item.category === filters.category;
      
      // Фильтр по дате (упрощенно для примера)
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
    });
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
          
          <div className={styles.filterGroup}>
            <div className={styles.filterLabel}>
              <CalendarTodayIcon fontSize="small" />
              <span>Период</span>
            </div>
            <div className={styles.filterOptions}>
              {DATE_RANGES.map(range => (
                <button
                  key={range.id}
                  className={`${styles.filterButton} ${filters.dateRange === range.id ? styles.active : ''}`}
                  onClick={() => handleDateRangeChange(range.id)}
                >
                  {range.name}
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
        ) : filteredNews.length > 0 ? (
          <div className={styles.newsList}>
            {filteredNews.map(news => (
              <div key={news.id} className={styles.newsCard}>
                <div className={styles.newsImageContainer}>
                  <div className={styles.newsImage} style={{ backgroundImage: `url(/api/placeholder/400/200)` }} />
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
                        <img src="/api/placeholder/40/40" alt={news.author.name} />
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
                    
                    <button className={styles.readMoreButton}>
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