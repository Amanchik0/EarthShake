export interface Event {
    id: string;
    title: string;
    date: string;
    type: string;
    description?: string[];
    location?: string;
    rating?: number;
    reviewsCount?: number;
    imageUrl?: string;
    tag: 'regular' | 'emergency';
    author: {
      name: string;
      role: string;
      avatarUrl: string;
    };

  price?: string;

  }
  
  export interface Comment {
    id: string;
    author: string;
    avatarUrl: string;
    date: string;
    text: string;
  }
  
  export interface RecommendedEvent {
    id: string;
    title: string;
    date: string;
    type: string;
    imageUrl: string;
  }

  
  export interface FilterOption {
    value: string;
    label: string;
  }
  
  export interface FilterConfig {
    label: string;
    options: FilterOption[];
  }
  export interface Community {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  description: string[];
  avatarUrl: string;
  coverUrl?: string;
  membersCount: number;
  eventsCount: number;
  rating: number;
  postsCount: number;
  isMember: boolean;
}

export interface Admin {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  participantsCount: number;
  imageUrl: string;
}

export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
}