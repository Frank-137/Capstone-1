import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { EventType, WarPeriod } from '@/lib/types';

export interface ClusterFilter {
  period: WarPeriod | null;
  types: EventType[];
  year: number;
  viewport?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export const useClusters = () => {
  const getFilteredClusters = useMutation({
    mutationFn: async (filter: ClusterFilter) => {
      // Build filter object
      const filterObject: {
        tag_filter?: { tags: string[] };
        date_filter?: { year: number };
        view?: {
          north: number;
          south: number;
          east: number;
          west: number;
        };
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

      // Add viewport if provided
      if (filter.viewport) {
        filterObject.view = filter.viewport;
      }

      console.log('Request URL:', '/api/clusters/hierarchical');
      console.log(' Object:', JSON.stringify(filterObject, null, 2));

      try {
        const response = await api.post('/api/clusters/hierarchical', filterObject);
        console.log('API Response Data:', response.data);
        return Array.isArray(response.data.data) ? response.data.data : [];
      } catch (error) {
        throw new Error(`Failed to fetch clusters: ${error}`);
      }
    }
  });

  const getClusterById = useMutation({
    mutationFn: async (clusterId: number) => {
      const url = `/api/clusters/${clusterId}`;
      
      console.log('Cluster Request URL:', url);
      
      try {
        const response = await api.get(url);
        console.log('API Response Data:', response.data);
        return response.data;
      } catch (error) {
        throw new Error(`Failed to fetch cluster: ${error}`);
      }
    }
  });

  return {
    getFilteredClusters,
    getClusterById
  };
}; 