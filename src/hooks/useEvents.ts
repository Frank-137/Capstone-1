import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { HistoricalEvent, EventType, WarPeriod } from '@/lib/types';

export interface EventFilter {
  period: WarPeriod | null;
  types: EventType[];
  year: number;
}

export const useEvents = () => {
  const getFilteredEvents = useMutation({
    mutationFn: async (filter: EventFilter) => {
      // Build filter object
      const filterObject: {
        tag_filter?: { tags: string[] };
        date_filter?: { year: number };
      } = {};

      // Convert period and event types to tags
      const tags: string[] = [];
      
      // Add period as tag if exists
      if (filter.period) {
        tags.push(filter.period);
      }
      
      // Add event types as tags
      if (filter.types.length > 0) {
        tags.push(...filter.types);
      }
      
      // Add tag filter if there are any tags
      if (tags.length > 0) {
        filterObject.tag_filter = { tags };
      }
      
      // Add date filter
      filterObject.date_filter = { year: filter.year };
      
      console.log('Request URL:', '/api/events/filter');
      console.log('Filter Object:', JSON.stringify(filterObject, null, 2));
      
      try {
        const response = await api.post('/api/events/filter', filterObject);
        console.log('API Response Data:', response.data);
        return Array.isArray(response.data.data) ? response.data.data : [];
      } catch (error) {
        throw new Error(`Failed to fetch events: ${error}`);
      }
    }
  });

  const getLatLonDate = useMutation({
    mutationFn: async (params: { lat: number; lon: number; date: string }) => {
      const url = `/api/events/lat-lon-date?lat=${params.lat}&lon=${params.lon}&date=${params.date}`;
      
      console.log('Location Request URL:', url);
      console.log('Location Params:', params);
      
      try {
        const response = await api.get(url);
        console.log('API Response Data:', response.data);
        return response.data as HistoricalEvent[];
      } catch (error) {
        throw new Error(`Failed to fetch events by location: ${error}`);
      }
    }
  });

  return {
    getFilteredEvents,
    getLatLonDate
  };
}; 