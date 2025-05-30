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
  readonly score?: number | null;
  readonly mediaUrl?: string; // Вернули к строке
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

// Основной интерфейс для данных с бэкенда
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
  readonly mediaUrl: string; // Поддержка обеих вариантов для обратной совместимости
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
  readonly comments: Array<{
    readonly id: string;
    readonly author: string;
    readonly text: string;
    readonly date: string;
    readonly avatarUrl: string;
  }>;
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

// Интерфейс для обновления события (только изменяемые поля)
export interface EventUpdateData {
  readonly id: string;
  readonly eventType: 'REGULAR' | 'EMERGENCY';
  readonly emergencyType: string | null;
  readonly title: string;
  readonly description: string;
  readonly content: string;
  readonly city: string;
  readonly location: {
    readonly x: number;
    readonly y: number;
    readonly coordinates: [number, number];
    readonly type: string;
  };
  readonly mediaUrl: string | string[];
  readonly dateTime: string;
  readonly tags: string[];
  readonly metadata: {
    readonly address?: string;
    readonly scheduledDate?: string;
    readonly createdAt?: string;
  };
}