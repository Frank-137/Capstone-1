export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export type EventType = 
  | 'agreements'
  | 'assassinations'
  | 'attacks'
  | 'battles'
  | 'conferences'
  | 'declarations'
  | 'developments'
  | 'invasions'
  | 'mutinies'
  | 'operations'
  | 'surrender'
  | 'surrenders'
  | 'threats'
  | 'trials'
  | 'uprisings';

export type WarPeriod = 'wwi' | 'wwii';

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: GeoCoordinates;
  lat: number;  // Direct lat coordinate
  lon: number;  // Direct lon coordinate
  type: EventType;
  period: WarPeriod;
  countryCode?: string;
  imageUrl?: string;
  tags?: string[];
}

export interface EventRelationship {
  source: string; // event ID
  target: string; // event ID
  type: 'cause' | 'effect' | 'related';
  strength: number; // 1-10, represents the strength of the relationship
  description?: string;
}

export interface RelationshipNode {
  id: string;
  label: string;
  type: EventType;
  period: WarPeriod;
}

export interface RelationshipLink {
  source: string;
  target: string;
  type: string;
  strength: number;
}

export interface RelationshipGraph {
  nodes: RelationshipNode[];
  links: RelationshipLink[];
}

// API Request Types
export interface DateFilterRequest {
  year?: number;
}

export interface TagFilterRequest {
  tags: string[];
}

export interface ViewportRequest {
  north: number;
  south: number;
  east: number;
  west: number;
}