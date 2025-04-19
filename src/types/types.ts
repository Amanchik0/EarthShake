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