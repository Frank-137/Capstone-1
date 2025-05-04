
import { EventRelationship, RelationshipGraph } from '../lib/types';
import { historicalEvents } from './events';

// Sample relationships between historical events
export const eventRelationships: EventRelationship[] = [
  // World War I chain of events
  {
    source: 'ww1-1', // Assassination of Franz Ferdinand
    target: 'ww1-2', // Battle of the Somme
    type: 'cause',
    strength: 8,
    description: 'The assassination led to war declarations that eventually resulted in major battles like the Somme.'
  },
  {
    source: 'ww1-2', // Battle of the Somme
    target: 'ww1-3', // Treaty of Versailles
    type: 'cause',
    strength: 6,
    description: 'The tremendous casualties of battles like the Somme contributed to the war\'s end and the harsh peace terms.'
  },
  {
    source: 'ww1-3', // Treaty of Versailles
    target: 'interwar-1', // Wall Street Crash
    type: 'related',
    strength: 4,
    description: 'War debts and economic restructuring after WWI contributed to economic instability leading to the crash.'
  },
  {
    source: 'ww1-3', // Treaty of Versailles
    target: 'ww2-1', // German Invasion of Poland
    type: 'cause',
    strength: 9,
    description: 'The harsh terms of the Treaty of Versailles caused resentment in Germany, contributing to the rise of Nazism and WWII.'
  },
  
  // World War II relationships
  {
    source: 'ww2-1', // German Invasion of Poland
    target: 'ww2-2', // Pearl Harbor
    type: 'related',
    strength: 3,
    description: 'Both events were part of the Axis powers\' aggressive expansion, though separately planned.'
  },
  {
    source: 'ww2-2', // Pearl Harbor
    target: 'ww2-3', // D-Day
    type: 'cause',
    strength: 7,
    description: 'U.S. entry into the war after Pearl Harbor made possible the massive resources needed for D-Day.'
  },
  {
    source: 'ww2-3', // D-Day
    target: 'ww2-4', // Atomic Bombings
    type: 'related',
    strength: 5,
    description: 'Allied success in Europe allowed the U.S. to focus resources on the Pacific theater and develop the Manhattan Project.'
  },
  {
    source: 'ww2-4', // Atomic Bombings
    target: 'ww2-5', // Surrender of Japan
    type: 'cause',
    strength: 10,
    description: 'The atomic bombings were a direct cause of Japan\'s surrender, ending World War II.'
  }
];

// Convert the relationships data to a graph format for visualization
export const createRelationshipGraph = (): RelationshipGraph => {
  const nodes = historicalEvents.map(event => ({
    id: event.id,
    label: event.title,
    type: event.type,
    period: event.period
  }));
  
  const links = eventRelationships.map(relationship => ({
    source: relationship.source,
    target: relationship.target,
    type: relationship.type,
    strength: relationship.strength
  }));
  
  return { nodes, links };
};

// Get related events for a given event ID
export const getRelatedEvents = (eventId: string) => {
  // Find relationships where the event is either source or target
  const relationships = eventRelationships.filter(
    rel => rel.source === eventId || rel.target === eventId
  );
  
  // Extract the related event IDs
  const relatedIds = relationships.map(rel => 
    rel.source === eventId ? rel.target : rel.source
  );
  
  // Get the full event details for these IDs
  return historicalEvents.filter(event => relatedIds.includes(event.id));
};

// Get the specific relationship between two events
export const getRelationship = (sourceId: string, targetId: string) => {
  return eventRelationships.find(
    rel => (rel.source === sourceId && rel.target === targetId) ||
           (rel.source === targetId && rel.target === sourceId)
  );
};

// Helper to get relationship data for a specific event
export const getEventRelationships = (eventId: string) => {
  return eventRelationships.filter(
    rel => rel.source === eventId || rel.target === eventId
  );
};
