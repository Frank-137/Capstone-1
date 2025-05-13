import { useMutation } from '@tanstack/react-query';
import api, { endpoints } from '@/lib/api';

interface Cluster {
  id: string;
  center: {
    lat: number;
    lon: number;
  };
  events: Array<{
    id: string;
    lat: number;
    lon: number;
  }>;
}

interface HierarchicalCluster {
  id: string;
  children: HierarchicalCluster[];
  events: Array<{
    id: string;
    lat: number;
    lon: number;
  }>;
}

export const useClusters = () => {
  const insertClusters = useMutation({
    mutationFn: async (clusters: Cluster[]) => {
      const data = await api.post(endpoints.clusters.insert, clusters);
      return data;
    },
  });

  const getHierarchicalClusters = useMutation({
    mutationFn: async () => {
      const data = await api.post(endpoints.clusters.getHierarchical, {});
      return data as HierarchicalCluster[];
    },
  });

  return {
    insertClusters,
    getHierarchicalClusters,
  };
}; 