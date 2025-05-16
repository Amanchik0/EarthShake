 export  interface Community {
    id: string;
    name: string;
    description: string | string[];
    imageUrl: string;
    numberMembers: number;
 }
export interface CommunityDetails extends Community {
  avatarUrl: string;
  coverUrl?: string;
  location: string;
  dopDescription?: string[]; 
  createdAt: string;
  eventsCount: number;
  rating: number;
  postsCount: number;
  isMember: boolean;
  category: string;
  
}
