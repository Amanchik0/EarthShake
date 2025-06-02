// src/types/emergencyTypes.ts
export type EmergencyType = 
  | 'EARTHQUAKE'
  | 'FLOOD'
  | 'FIRE'
  | 'STORM'
  | 'TORNADO'
  | 'TSUNAMI'
  | 'DROUGHT'
  | 'LANDSLIDE'
  | 'PANDEMIC'
  | 'CHEMICAL_SPILL'
  | 'RADIATION_LEAK'
  | 'TRANSPORT_ACCIDENT'
  | 'TERROR_ATTACK'
  | 'EXPLOSION'
  | 'INFRASTRUCTURE_FAILURE'
  | 'OTHER'
  | 'VOLCANO'
  | 'TYPHOON';

export interface EmergencyEvent {
  id: string;
  country: string;
  emergencyType: EmergencyType;
  about: string;
  coordinates: {
    x: number;
    y: number;
  };
  city: string;
  date: string;
}

export interface EvacuationPoint {
  x: number;
  y: number;
}

export interface ReferenceInfo {
  emergencyType: EmergencyType;
  city: string;
  evacuationPoints: EvacuationPoint[];
  safetyInstructions: string[];
  emergencyContacts: string[];
  localizedInfo: {
    en?: string;
    ru?: string;
  };
}

export interface EmergencyResponse {
  event: EmergencyEvent[];
  referenceInfo: ReferenceInfo[];
}

export const EMERGENCY_TYPE_LABELS: Record<EmergencyType, string> = {
  EARTHQUAKE: 'Землетрясение',
  FLOOD: 'Наводнение',
  FIRE: 'Пожар',
  STORM: 'Шторм/Ураган',
  TORNADO: 'Торнадо',
  TSUNAMI: 'Цунами',
  DROUGHT: 'Засуха',
  LANDSLIDE: 'Оползень',
  PANDEMIC: 'Пандемия',
  CHEMICAL_SPILL: 'Химическая утечка',
  RADIATION_LEAK: 'Радиационная утечка',
  TRANSPORT_ACCIDENT: 'ДТП/Транспортная авария',
  TERROR_ATTACK: 'Террористическая атака',
  EXPLOSION: 'Взрыв',
  INFRASTRUCTURE_FAILURE: 'Отказ инфраструктуры',
  VOLCANO: 'Извержение вулкана',
  TYPHOON: 'Тайфун',
  OTHER: 'Чрезвычайная ситуация'
};

export const EMERGENCY_TYPE_ICONS: Record<EmergencyType, string> = {
  EARTHQUAKE: '🏚️',
  FLOOD: '🌊',
  FIRE: '🔥',
  STORM: '⛈️',
  TORNADO: '🌪️',
  TSUNAMI: '🌊',
  DROUGHT: '🏜️',
  LANDSLIDE: '⛰️',
  PANDEMIC: '🦠',
  CHEMICAL_SPILL: '☣️',
  RADIATION_LEAK: '☢️',
  TRANSPORT_ACCIDENT: '🚗💥',
  TERROR_ATTACK: '💣',
  EXPLOSION: '💥',
  INFRASTRUCTURE_FAILURE: '⚡',
  VOLCANO: '🌋',
  TYPHOON: '🌪️',
  OTHER: '⚠️'
};

export const EMERGENCY_TYPE_COLORS: Record<EmergencyType, string> = {
  EARTHQUAKE: '#8B4513',
  FLOOD: '#1E90FF',
  FIRE: '#FF4500',
  STORM: '#4682B4',
  TORNADO: '#708090',
  TSUNAMI: '#00CED1',
  DROUGHT: '#DEB887',
  LANDSLIDE: '#A0522D',
  PANDEMIC: '#DC143C',
  CHEMICAL_SPILL: '#32CD32',
  RADIATION_LEAK: '#FFD700',
  TRANSPORT_ACCIDENT: '#FF6347',
  TERROR_ATTACK: '#8B0000',
  EXPLOSION: '#FF1493',
  INFRASTRUCTURE_FAILURE: '#FF8C00',
  VOLCANO: '#B22222',
  TYPHOON: '#4169E1',
  OTHER: '#696969'
};