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
  readonly usersIds?: string[] | string;
    readonly reviewsCount?: number; // Добавляем reviewsCount

  readonly tag: 'regular' | 'emergency';
  readonly author: {
    readonly name: string;
    readonly role: string;
    readonly avatarUrl: string;
  } | string; // Может быть строкой или объектом
  readonly price?: string;
  readonly lat: number;
  readonly lng?: number;
  readonly score: number | null;
  readonly mediaUrl?: string;
  readonly dateTime: string;
  readonly content?: string;
  readonly location?: {
    readonly coordinates: [number, number];
  };
  readonly comments: Record<string, EventComment>;
  readonly commentsCount?: number;
  readonly tags?: string[]; // Добавляем массив тегов
  readonly metadata?: {
    readonly address?: string;
    readonly scheduledDate?: string;
    readonly createdAt?: string;
  }; // Добавляем metadata
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

// Основной интерфейс для данных с бэкенда (используем напрямую)
export interface BackendEventData {
  readonly id: string;
  readonly eventType: 'REGULAR' | 'EMERGENCY';
  readonly emergencyType: string | null;
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly author: string;
  readonly city: string;
  readonly location: {
    readonly x: number;
    readonly y: number;
    readonly coordinates: [number, number];
    readonly type: string;
  };
  readonly mediaUrl: string;
  readonly score: number | null;
  readonly dateTime: string;
  readonly eventStatus: string | null;
  readonly tags: string[];
  readonly usersIds: string[];
  readonly metadata: {
    readonly address?: string;
    readonly scheduledDate?: string;
    readonly createdAt?: string;
  };
  readonly comments: Record<string, any>;
  readonly archived: boolean | null;
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