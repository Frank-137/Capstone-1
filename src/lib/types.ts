
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export type EventType = 'battle' | 'treaty' | 'political' | 'economic';
export type WarPeriod = 'ww1' | 'ww2' | 'interwar';

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: GeoCoordinates;
  type: EventType;
  period: WarPeriod;
  countryCode?: string;
  imageUrl?: string;
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
