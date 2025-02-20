export interface DataItem {
  id: number;
  name: string;
  // можно добавить дополнительные поля, например: цену и тд тп => потом передадим на бэк чет такое 
  description?: string;
  date?: string;
  location?: string;
}