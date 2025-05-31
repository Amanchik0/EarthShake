// types/community.ts - обновленная версия

// Базовый интерфейс сообщества (как в API)
export interface Community {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly imageUrls: string[];
  readonly numberMembers: number;
  readonly type: string; // category
  readonly createdAt: string;
  readonly rating: number;
  readonly reviewsCount: number;
  readonly content: string;
  readonly city: string;
  readonly eventsCount: number;
  readonly postsCount: number;
  readonly users: string[]; // id пользователей
  readonly author: string; // id автора
  readonly listEvents: string[]; // id событий
}

// Расширенные детали сообщества для отображения
export interface CommunityDetails extends Community {
  readonly avatarUrl: string; // первое изображение из imageUrls
  readonly coverUrl?: string; // второе изображение из imageUrls (если есть)
  readonly location: string; // отображаемое название города
  readonly isMember: boolean; // является ли текущий пользователь участником
  readonly isAuthor: boolean; // является ли текущий пользователь автором
  readonly category: string; // то же что и type, но для отображения
}

// Данные для создания сообщества (отправляемые на сервер)
export interface CommunityCreateData {
  name: string;
  description: string;
  content: string;
  imageUrls: string[];
  type: string; // category
  city: string;
  author: string;
}

// Данные для обновления сообщества (PUT /community/update)
export interface CommunityUpdateData {
  id: string;
  name: string;
  description: string;
  imageUrls: string[];
  numberMembers: number;
  type: string;
  createdAt: string;
  rating: number;
  reviewsCount: number;
  content: string;
  city: string;
  eventsCount: number;
  postsCount: number;
  users: string[];
  author: string;
  listEvents: string[];
}

// Данные формы создания сообщества
export interface CommunityFormData {
  name: string;
  description: string;
  content: string;
  category: string;
  city: string;
  location: string;
  imageUrl: string; // одно изображение в форме
}

// Администратор сообщества
export interface Admin {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly avatarUrl: string;
}

// Событие сообщества - расширенная версия с дополнительными полями
export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // Отформатированная дата для отображения
  time: string; // Отформатированное время для отображения
  participantsCount: number;
  imageUrl: string;
  // Дополнительные поля из API
  description?: string;
  author?: string;
  city?: string;
  tags?: string[];
  eventType?: 'REGULAR' | 'EMERGENCY';
  location?: string; // Адрес или координаты
  // Дополнительные поля для фильтрации и сортировки
  status?: 'active' | 'archived'; // Статус события
  dateTime?: string; // Оригинальная дата/время из API для сортировки
  createdAt?: string; // Дата создания для сортировки
}

// Участник сообщества
export interface Member {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl: string;
}

// Ответ API при создании сообщества
export interface CommunityCreateResponse extends Community {}

// Утилитарная функция для преобразования Community в CommunityDetails
export const toCommunityDetails = (community: Community, currentUserId?: string): CommunityDetails => {
  return {
    ...community,
    avatarUrl: community.imageUrls[0] || '/api/placeholder/150/150',
    coverUrl: community.imageUrls[1],
    location: community.city,
    isMember: currentUserId ? community.users.includes(currentUserId) : false,
    isAuthor: currentUserId ? community.author === currentUserId : false,
    category: community.type,
  };
};

// Утилитарная функция для поиска сообществ
export const searchCommunities = (communities: CommunityDetails[], query: string): CommunityDetails[] => {
  if (!query.trim()) return communities;
  
  const searchTerm = query.toLowerCase().trim();
  
  return communities.filter(community => 
    community.name.toLowerCase().includes(searchTerm) ||
    community.description.toLowerCase().includes(searchTerm) ||
    community.city.toLowerCase().includes(searchTerm) ||
    community.category.toLowerCase().includes(searchTerm) ||
    community.author.toLowerCase().includes(searchTerm)
  );
};

// Утилитарная функция для получения отображаемого названия категории
export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'active': 'Активный отдых',
    'education': 'Образование',
    'creative': 'Творчество',
    'tech': 'Технологии',
    'entertainment': 'Развлечения',
    'sports': 'Спорт',
    'business': 'Бизнес',
    'science': 'Наука',
    'health': 'Здоровье',
    'art': 'Искусство',
  };
  
  return categoryMap[category] || category;
};

// Утилитарные функции для работы с событиями

// Фильтрация событий
export const filterEvents = (
  events: CommunityEvent[], 
  filters: {
    searchQuery?: string;
    status?: 'all' | 'active' | 'archived';
    type?: 'all' | 'REGULAR' | 'EMERGENCY';
  }
): CommunityEvent[] => {
  return events.filter(event => {
    // Поиск по названию и описанию
    const matchesSearch = !filters.searchQuery || 
      event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());

    // Фильтр по статусу
    const matchesStatus = !filters.status || filters.status === 'all' || 
      (filters.status === 'active' && event.status === 'active') ||
      (filters.status === 'archived' && event.status === 'archived');

    // Фильтр по типу
    const matchesType = !filters.type || filters.type === 'all' || event.eventType === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });
};

// Сортировка событий
export const sortEvents = (
  events: CommunityEvent[], 
  sortBy: 'date' | 'participants' | 'created',
  sortOrder: 'asc' | 'desc' = 'asc'
): CommunityEvent[] => {
  return [...events].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'date':
        comparison = new Date(a.dateTime || '').getTime() - new Date(b.dateTime || '').getTime();
        break;
      case 'participants':
        comparison = a.participantsCount - b.participantsCount;
        break;
      case 'created':
        comparison = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        break;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Получение статистики событий
export const getEventsStats = (events: CommunityEvent[]) => {
  return {
    total: events.length,
    active: events.filter(e => e.status === 'active').length,
    archived: events.filter(e => e.status === 'archived').length,
    regular: events.filter(e => e.eventType === 'REGULAR').length,
    emergency: events.filter(e => e.eventType === 'EMERGENCY').length,
  };
};