type DeepReadonly<Obj extends Record<string, unknown> | ReadonlyArray<unknown> | undefined> = {
  +readonly [Key in keyof Obj]: Obj[Key] extends Record<string, unknown> | ReadonlyArray<unknown> | undefined 
    ? DeepReadonly<Obj[Key]> 
    : Obj[Key]
} & unknown
// todo надо будет все типы поменять и сделать так чтобы везде были читаемые 

type EventTest = DeepReadonly<{
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
}>

// const x: EventTest = {}

// x.author.name = 'sadfdsfds'

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

  


  
export interface Community {
  id: string;
  name: string;
  avatarUrl: string;
  coverUrl?: string;
  location: string;
  createdAt: string;
  description: string[];
  membersCount: number;
  eventsCount: number;
  rating: number;
  postsCount: number;
  isMember: boolean;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  participantsCount: number;
  imageUrl: string;
}


//


export interface Admin {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}



export interface Member {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface StatisticsBarProps {
  membersCount: number;
  eventsCount: number;
  rating: number;
  postsCount: number;
}
 /// evacuationTypes
export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'shelter' | 'medical' | 'food';
  status: 'open' | 'limited' | 'full';
  capacity: number;
  workingHours: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface InfoItem {
  id: string;
  icon: string;
  title: string;
  text: string;
}
export interface Location {
  id: string;
  name: string;
  address: string;
  type: 'shelter' | 'medical' | 'food';
  status: 'open' | 'limited' | 'full';
  capacity: number;
  workingHours: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface InfoItem {
  id: string;
  icon: string;
  title: string;
  text: string;
}

// profile

export interface ProfileHeaderProps {
  name: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  registrationDate: string;
  subscription?: boolean;
}

export interface EventCardProps {
  title: string;
  date: string;
  participants: string;
  imageUrl: string;
}


export interface CommunityCardProps {
  name: string;
  members: string;
  logoUrl: string;
}
export interface ProfileTabsProps {
  activeTab: number;
  onTabChange: (index: number) => void;
}

// profile edit 

export interface ProfilePhotoUploadProps {
  photoUrl: string;
  onPhotoChange: () => void;
}

export interface ProfileFormData {

    firstName: string;
    lastName: string;
    email: string;
    bio: string;
  
}

//event edit 
export interface EventPhotoUploadProps {
  photoUrl: string;
  onPhotoChange: () => void;
}

export interface EventDateTimeInputProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
}
export interface EventFormData {
  name: string;
  description: string;
  location: string;
  type: string;
  date: string;
  time: string;
  photoUrl: string;
}

export interface EventFormProps {
  initialData: EventFormData;
  onCancel: () => void;
  onSubmit: (data: EventFormData) => void;
}