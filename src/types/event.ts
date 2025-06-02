// types/event.ts

export interface Event {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly description?: string | string[];
  readonly imageUrl: string;
  readonly city: string;
}

export interface EventDetails extends Event {
  readonly type: string;
  readonly rating?: number;
  readonly reviewsCount?: number;
  readonly usersIds?: string[] | string;
  readonly tag: 'regular' | 'emergency';
  readonly author: {
    readonly name: string;
    readonly role: string;
    readonly avatarUrl: string;
  } | string;
  readonly price?: string;
  readonly lat: number;
  readonly lng?: number;
  readonly score?: number | null | UserScore[];
  readonly mediaUrl?: string | string[];
  readonly dateTime: string;
  readonly content?: string;
  readonly location: {
    readonly coordinates: [number, number];
  };
  readonly comments: Record<string, EventComment>;
  readonly commentsCount?: number;
  readonly tags?: string[];
  readonly metadata?: {
    readonly address?: string;
    readonly scheduledDate?: string;
    readonly createdAt?: string;
  };
}

export interface EventComment {
  readonly id: string;
  readonly author: string;
  readonly avatarUrl: string;
  readonly date: string;
  readonly text: string;
}

export interface RecommendedEvent {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly type: string;
  readonly imageUrl: string;
}

// Интерфейс для оценки пользователя
export interface UserScore {
  readonly username?: string;
  readonly rating?: number;
  readonly [key: string]: any; // Для поддержки формата {username: rating}
}

// Интерфейс для данных сообщества
export interface CommunityData {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly imageUrls?: string[]; // Массив изображений
  readonly createdAt?: string;
  readonly membersCount?: number;
  readonly isActive?: boolean;
  readonly creatorId?: string;
  readonly category?: string;
  readonly tags?: string[];
}

// Основной интерфейс для данных с бэкенда (обновлен под новую структуру)
export interface BackendEventData {
  readonly id: string;
  readonly eventType: 'REGULAR' | 'EMERGENCY';
  readonly emergencyType?: string;
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly author: string;
  readonly city: string;
  readonly location: {
    readonly x: number;
    readonly y: number;
    readonly coordinates?: [number, number];
    readonly type?: string;
  };
  readonly mediaUrl: string | string[];
  readonly score?: UserScore[] | number | null; // Поддержка массива оценок
  readonly dateTime: string;
  readonly eventStatus?: string | null;
  readonly tags: string[];
  readonly usersIds: string[];
  readonly metadata: {
    readonly address?: string;
    readonly scheduledDate?: string;
    readonly createdAt?: string;
    readonly isCommunity?: string | boolean; // Поддержка строки и boolean
    readonly communityId?: string; // ID сообщества
  };
  readonly comments: Array<{
    readonly id: string;
    readonly author: string;
    readonly text: string;
    readonly date: string;
    readonly avatarUrl: string;
  }>;
  readonly archived?: boolean;
}

// Интерфейс для пользователя с бэкенда
export interface BackendUserData {
  readonly id: string;
  readonly username: string;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly imageUrl?: string;
  readonly bio?: string;
  readonly location?: string;
  readonly dateJoined?: string;
  readonly isActive?: boolean;
}

// Интерфейсы для интерактивных действий
export interface UserRating {
  readonly userId: string;
  readonly rating: number;
  readonly date: string;
}

export interface NewComment {
  readonly text: string;
}

export interface NewRating {
  readonly rating: number; 
}

// Интерфейс для обновления события (упрощенная структура для API)
export interface EventUpdateData {
  readonly eventType: 'REGULAR' | 'EMERGENCY';
  readonly emergencyType?: string;
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly author: string;
  readonly city: string;
  readonly location: {
    readonly x: number;
    readonly y: number;
  };
  readonly mediaUrl: string[];
  readonly dateTime: string;
  readonly tags: string[];
  readonly usersIds: string[];
  readonly metadata: {
    readonly address?: string;
    readonly scheduledDate?: string;
    readonly createdAt?: string;
    readonly isCommunity?: string | boolean;
    readonly communityId?: string;
  };
  readonly comments: Array<{
    readonly id: string;
    readonly author: string;
    readonly text: string;
    readonly date: string;
    readonly avatarUrl: string;
  }>;
  readonly archived: boolean;
  readonly score?: UserScore[];
}

// Утилитарные функции для работы с данными
export const transformEventData = (event: BackendEventData): BackendEventData => {
  return {
    ...event,
    location: {
      ...event.location,
      coordinates: event.location.coordinates || [event.location.x, event.location.y]
    },
    mediaUrl: Array.isArray(event.mediaUrl) ? event.mediaUrl : [event.mediaUrl].filter(Boolean),
    comments: Array.isArray(event.comments) ? event.comments : [],
    archived: event.archived ?? false,
    eventStatus: event.eventStatus || 'ACTIVE'
  };
};

export const getFirstMediaUrl = (mediaUrl: string | string[]): string => {
  if (Array.isArray(mediaUrl)) {
    return mediaUrl[0] || '/api/placeholder/600/400';
  }
  return mediaUrl || '/api/placeholder/600/400';
};

export const getAllMediaUrls = (mediaUrl: string | string[]): string[] => {
  if (Array.isArray(mediaUrl)) {
    return mediaUrl.filter(Boolean);
  }
  return mediaUrl ? [mediaUrl] : [];
};

// Утилитарные функции для работы с оценками
export const getScoresArray = (score: UserScore[] | number | null | undefined): UserScore[] => {
  if (!score) return [];
  if (Array.isArray(score)) return score;
  return [];
};

export const getUserScore = (scores: UserScore[], username: string): number => {
  if (!username) return 0;
  const userScore = scores.find(score => score.username === username);
  if (userScore) {
    return userScore.rating || Object.values(userScore).find(val => typeof val === 'number') || 0;
  }
  return 0;
};

export const getAverageScore = (scores: UserScore[]): number => {
  if (scores.length === 0) return 0;
  
  const total = scores.reduce((sum, score) => {
    // Поддержка разных форматов: {username: rating} или {username: "name", rating: number}
    const rating = score.rating || Object.values(score).find(val => typeof val === 'number') || 0;
    return sum + rating;
  }, 0);
  
  return total / scores.length;
};

export const updateUserScore = (scores: UserScore[], username: string, rating: number): UserScore[] => {
  const existingScoreIndex = scores.findIndex(score => score.username === username);
  
  if (existingScoreIndex !== -1) {
    // Обновляем существующую оценку
    const updatedScores = [...scores];
    updatedScores[existingScoreIndex] = { [username]: rating };
    return updatedScores;
  } else {
    // Добавляем новую оценку
    return [...scores, { [username]: rating }];
  }
};

// Утилитарные функции для работы с сообществами
export const isCommunityEvent = (event: BackendEventData): boolean => {
  return event.metadata?.isCommunity === "true" || event.metadata?.isCommunity === true;
};

export const getCommunityId = (event: BackendEventData): string | undefined => {
  return isCommunityEvent(event) ? event.metadata?.communityId : undefined;
};