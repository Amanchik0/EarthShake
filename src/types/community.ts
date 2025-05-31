// types/community.ts

export interface Community {
  readonly id: string;
  readonly name: string;
  readonly description: string | string[];
  readonly imageUrl: string[];
  readonly numberMembers: number;
  readonly type?: string; // category
  readonly createdAt?: string;
  readonly rating?: number;
  readonly reviewsCount?: number;
  readonly content?: string; // Дополнительная информация
  readonly city?: string;
  readonly eventsCount?: number;
  readonly postsCount?: number;
  readonly users?: string[]; // id пользователей
  readonly author?: string; // id автора
  readonly listEvents?: string[]; // id событий
}

export interface CommunityDetails extends Community {
  readonly avatarUrl: string;
  readonly coverUrl?: string | undefined;
  readonly location: string;
  readonly dopDescription?: string[]; 
  readonly createdAt: string;
  readonly eventsCount: number;
  readonly rating: number;
  readonly postsCount: number;
  readonly isMember: boolean;
  readonly category: string;
  readonly membersCount: number; // Добавляем для совместимости со старыми компонентами
}

export interface CommunityCreate {
  readonly name: string;
  readonly description: string | string[];
  readonly category?: string;
  readonly location?: string;
  readonly dopDescription?: string[];
  readonly imageUrls?: string[];
}

// API Response типы
export interface ApiCommunityResponse {
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

// Дополнительные типы для компонентов сообщества
export interface Admin {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly avatarUrl: string;
}

export interface Member {
  readonly id: string;
  readonly name: string;
  readonly avatarUrl: string;
}

export interface CommunityEvent {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly time: string;
  readonly participantsCount: number;
  readonly imageUrl: string;
}

// Типы для фильтрации и поиска
export interface CommunityFilters {
  category?: string;
  city?: string;
  search?: string;
  memberCount?: {
    min?: number;
    max?: number;
  };
  rating?: {
    min?: number;
  };
}

export interface CommunityListResponse {
  communities: ApiCommunityResponse[];
  totalCount: number;
  page: number;
  pageSize: number;
}

// Типы для создания/редактирования
export interface CommunityFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  dopDescription?: string;
  imageFiles?: File[];
  existingImageUrls?: string[];
}

// Enum для категорий сообществ
export enum CommunityCategory {
  HOBBY = 'hobby',
  TECHNOLOGY = 'technology',
  ARTS = 'arts',
  SPORTS = 'sports',
  EDUCATION = 'education',
  SOCIAL = 'social',
  BUSINESS = 'business',
  OTHER = 'other'
}

// Enum для ролей в сообществе
export enum CommunityRole {
  CREATOR = 'Создатель',
  ADMIN = 'Администратор',
  MODERATOR = 'Модератор',
  MEMBER = 'Участник'
}