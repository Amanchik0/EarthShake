 export  interface Community {
    readonly id: string;
    readonly name: string;
    readonly description: string | string[];
    readonly imageUrl: string[];
    readonly numberMembers: number;
    // type: string; //category
    // cratedAt: string;
    // rating: number;
    // reviewsCount: number;
    // content?: string[]; // Дополнительная 
    // city: string;
    // eventsCount: number;
    // postsCount: number;
    // //автора и пользаков сам достану 
    // users: string[]; //id пользователей
    // author: string; //id автора
    // listEvents: string[]; //id событий
 }
 
export interface CommunityDetails extends Community {
  readonly avatarUrl: string;
  readonly coverUrl?: string;
  readonly location: string;
  readonly dopDescription?: string[]; 
  readonly createdAt: string;
  readonly eventsCount: number;
  readonly rating: number;
  readonly postsCount: number;
  readonly isMember: boolean;
  readonly category: string;
  
}
export interface CommunityCreate extends Community {
  readonly name: string;
  readonly description: string | string[];
  readonly category?: string;
  readonly location?: string;
  readonly dopDescription?: string[];
}
