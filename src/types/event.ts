export interface Event {
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly description?: string  | string[];  
    
    readonly imageUrl: string;
    readonly city: string;

}

export interface EventDetails extends Event {
    readonly type: string;
    readonly rating?: number;
    readonly reviewsCount?: number;
    readonly tag: 'regular' | 'emergency';
    readonly author: {
      readonly name: string;
      readonly role: string;
      readonly avatarUrl: string;
    };
    readonly price?: string;
    readonly lat: number;
    readonly lng?: number;
  }
