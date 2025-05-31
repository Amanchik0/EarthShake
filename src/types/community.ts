// types/community.ts

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

// Событие сообщества
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