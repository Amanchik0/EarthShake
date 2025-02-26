export interface Event {
  id: string;
  title: string;
  category: string;
  date: string;
  description?: string;
  naturalEevent?: boolean;
  // Опционально: для землетрясений
  magnitude?: number;
  // Для других событий, где используется радиус
  radius?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}
