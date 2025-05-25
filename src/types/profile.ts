
    //  профиль из API амира 
export interface FullProfile {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName: string | null;
  lastName: string;
  role: string;
  city: string;
  imageUrl: string | null;
  phoneNumber: string | null;
  registrationDate: string;
  metadata: any;
  subscriber: boolean;
  events?: EventData[];
  communities?: CommunityData[];
}

    // данные формы редактирования профиля
    export interface ProfileFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    city: string;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    imageUrl?: string | undefined;
    }
export interface ProfileFormInitialData extends ProfileFormData {
  id: string;
  username: string;
  role: string;
  registrationDate: string;
  metadata: any;
  subscriber: boolean;
}
    // данные для отображения профиля
    export interface ProfileInfo {
    name: string;
    username: string;
    email: string;
    phoneNumber: string;
    city: string;
    registrationDate: string;
    events: EventData[];
    communities: CommunityData[];
    hasSubscription: boolean;
      photoUrl?: string | undefined; 
    }

    // карточка события
    export interface EventData {
    id: string;
    title: string;
    date: string;
    participantsCount: number;
    imageUrl: string;
    }
    export interface EventCardProps {
    title: string;
    date: string;
    participants: string;
    imageUrl: string;
    }

    // карточка сообщества
    export interface CommunityData {
    id: string;
    name: string;
    membersCount: number;
    logoUrl: string;
    }
    export interface CommunityCardProps {
    name: string;
    members: string;
    logoUrl: string;
    }

    // табы профиля
    export interface ProfileTabsProps {
    activeTab: number;
    onTabChange: (index: number) => void;
    }

export interface ProfileHeaderProps {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  registrationDate: string;
  events: EventData[];
  communities: CommunityData[];
  hasSubscription: boolean;
  photoUrl?: string | undefined; 
  onProfileUpdate: (profile: ProfileInfo) => void;
}


    // секция подписки
    export interface SubscriptionSectionProps {
    hasSubscription: boolean;
    onSubscribe: () => void | Promise<void>;
    }
export interface ProfileView {
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  city: string;
  registrationDate: string;
  photoUrl?: string;
  hasSubscription: boolean;
  events: EventData[];
  communities: CommunityData[];
}

export interface ProfileEditValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  bio: string;
  photoUrl?: string;
  currentPassword: string;
  newPassword?: string;
  confirmNewPassword?: string;
}