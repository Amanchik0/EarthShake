// src/data/cities.ts

export interface City {
  id: string;
  name: string;
  nameEn: string;
  region: string;
}

export const kazakhstanCities: City[] = [
  // Алматы
  { id: 'almaty', name: 'Алматы', nameEn: 'Almaty', region: 'Алматы' },
  
  // Астана (Нур-Султан)
  { id: 'astana', name: 'Астана', nameEn: 'Astana', region: 'Акмолинская область' },
  { id: 'nur-sultan', name: 'Нур-Султан', nameEn: 'Nur-Sultan', region: 'Акмолинская область' },
  
  // Шымкент
  { id: 'shymkent', name: 'Шымкент', nameEn: 'Shymkent', region: 'Шымкент' },
  
  // Алматинская область
  { id: 'talgar', name: 'Талгар', nameEn: 'Talgar', region: 'Алматинская область' },
  { id: 'kapchagai', name: 'Капшагай', nameEn: 'Kapchagai', region: 'Алматинская область' },
  
  // Акмолинская область
  { id: 'kokshetau', name: 'Кокшетау', nameEn: 'Kokshetau', region: 'Акмолинская область' },
  { id: 'stepnogorsk', name: 'Степногорск', nameEn: 'Stepnogorsk', region: 'Акмолинская область' },
  
  // Актюбинская область
  { id: 'aktobe', name: 'Актобе', nameEn: 'Aktobe', region: 'Актюбинская область' },
  { id: 'alga', name: 'Алга', nameEn: 'Alga', region: 'Актюбинская область' },
  
  // Атырауская область
  { id: 'atyrau', name: 'Атырау', nameEn: 'Atyrau', region: 'Атырауская область' },
  
  // Восточно-Казахстанская область
  { id: 'oskemen', name: 'Усть-Каменогорск', nameEn: 'Oskemen', region: 'Восточно-Казахстанская область' },
  { id: 'semey', name: 'Семей', nameEn: 'Semey', region: 'Восточно-Казахстанская область' },
  { id: 'ridder', name: 'Риддер', nameEn: 'Ridder', region: 'Восточно-Казахстанская область' },
  
  // Жамбылская область
  { id: 'taraz', name: 'Тараз', nameEn: 'Taraz', region: 'Жамбылская область' },
  { id: 'karatau', name: 'Каратау', nameEn: 'Karatau', region: 'Жамбылская область' },
  
  // Западно-Казахстанская область
  { id: 'oral', name: 'Уральск', nameEn: 'Oral', region: 'Западно-Казахстанская область' },
  { id: 'aksai', name: 'Аксай', nameEn: 'Aksai', region: 'Западно-Казахстанская область' },
  
  // Карагандинская область
  { id: 'karaganda', name: 'Караганда', nameEn: 'Karaganda', region: 'Карагандинская область' },
  { id: 'temirtau', name: 'Темиртау', nameEn: 'Temirtau', region: 'Карагандинская область' },
  { id: 'zhezkazgan', name: 'Жезказган', nameEn: 'Zhezkazgan', region: 'Карагандинская область' },
  { id: 'balkhash', name: 'Балхаш', nameEn: 'Balkhash', region: 'Карагандинская область' },
  
  // Костанайская область
  { id: 'kostanay', name: 'Костанай', nameEn: 'Kostanay', region: 'Костанайская область' },
  { id: 'rudny', name: 'Рудный', nameEn: 'Rudny', region: 'Костанайская область' },
  { id: 'lisakovsk', name: 'Лисаковск', nameEn: 'Lisakovsk', region: 'Костанайская область' },
  
  // Кызылординская область
  { id: 'kyzylorda', name: 'Кызылорда', nameEn: 'Kyzylorda', region: 'Кызылординская область' },
  { id: 'baikonyr', name: 'Байконур', nameEn: 'Baikonyr', region: 'Кызылординская область' },
  
  // Мангистауская область
  { id: 'aktau', name: 'Актау', nameEn: 'Aktau', region: 'Мангистауская область' },
  { id: 'zhanaozen', name: 'Жанаозен', nameEn: 'Zhanaozen', region: 'Мангистауская область' },
  
  // Павлодарская область
  { id: 'pavlodar', name: 'Павлодар', nameEn: 'Pavlodar', region: 'Павлодарская область' },
  { id: 'ekibastuz', name: 'Экибастуз', nameEn: 'Ekibastuz', region: 'Павлодарская область' },
  
  // Северо-Казахстанская область
  { id: 'petropavl', name: 'Петропавловск', nameEn: 'Petropavl', region: 'Северо-Казахстанская область' },
  
  // Туркестанская область
  { id: 'turkestan', name: 'Туркестан', nameEn: 'Turkestan', region: 'Туркестанская область' },
  { id: 'kentau', name: 'Кентау', nameEn: 'Kentau', region: 'Туркестанская область' },
  { id: 'arys', name: 'Арыс', nameEn: 'Arys', region: 'Туркестанская область' }
];

// Функция для поиска городов
export const searchCities = (query: string): City[] => {
  if (!query) return kazakhstanCities;
  
  const lowerQuery = query.toLowerCase();
  return kazakhstanCities.filter(city => 
    city.name.toLowerCase().includes(lowerQuery) ||
    city.nameEn.toLowerCase().includes(lowerQuery)
  );
};

// Функция для группировки по регионам
export const getCitiesByRegion = (): Record<string, City[]> => {
  return kazakhstanCities.reduce((acc, city) => {
    if (!acc[city.region]) {
      acc[city.region] = [];
    }
    acc[city.region].push(city);
    return acc;
  }, {} as Record<string, City[]>);
};