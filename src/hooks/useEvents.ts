import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { HistoricalEvent, EventType, WarPeriod } from "@/lib/types";

export interface EventFilter {
  period: WarPeriod | null;
  types: EventType[];
  year: number;
  viewport: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  zoom?: number;
}

export interface Cluster {
  cluster_id: number;
  parent_cluster_id: number | null;
  centroid_lat: number;
  centroid_lon: number;
  centroid_time_days: number;
  level: number;
  event_ids: number[]; // ตามตัวอย่าง event_ids เป็น number (เช่น 101, 102) แก้จาก string[] เป็น number[]
  min_lat: number | null;
  max_lat: number | null;
  min_lon: number | null;
  max_lon: number | null;
  min_date: string | null;
  max_date: string | null;
  events?: HistoricalEvent[]; // เพิ่ม events เข้าไปใน Cluster
  point_count?: number;
  radius?: number;
  bounds?: {
    width: number;
    height: number;
    area: number;
  };
  time_span?: {
    days: number;
  };
  is_fully_visible?: boolean;
  is_partially_visible?: boolean;
}

// API Response type ใหม่ที่มี events กับ clusters ซ้อนกัน
interface ClusterResponse {
  status: string;
  data: Cluster[]; // data เป็น array ของ Cluster ตาม JSON ตัวอย่าง
}

// Utility functions
const calculateClusterBounds = (cluster: Cluster) => {
  const width = (cluster.max_lon ?? 0) - (cluster.min_lon ?? 0);
  const height = (cluster.max_lat ?? 0) - (cluster.min_lat ?? 0);
  const area = width * height;
  return { width, height, area };
};

const calculateTimeSpan = (cluster: Cluster) => {
  if (!cluster.min_date || !cluster.max_date) return { days: 0 };
  const start = new Date(cluster.min_date);
  const end = new Date(cluster.max_date);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return { days };
};

const isClusterFullyInViewport = (
  cluster: Cluster,
  viewport: EventFilter["viewport"]
): boolean => {
  return (
    (cluster.min_lat ?? -Infinity) >= viewport.south &&
    (cluster.max_lat ?? Infinity) <= viewport.north &&
    (cluster.min_lon ?? -Infinity) >= viewport.west &&
    (cluster.max_lon ?? Infinity) <= viewport.east
  );
};

const isClusterPartiallyInViewport = (
  cluster: Cluster,
  viewport: EventFilter["viewport"]
): boolean => {
  return !(
    (cluster.max_lat ?? -Infinity) < viewport.south ||
    (cluster.min_lat ?? Infinity) > viewport.north ||
    (cluster.max_lon ?? -Infinity) < viewport.west ||
    (cluster.min_lon ?? Infinity) > viewport.east
  );
};

export const useEvents = () => {
  const getFilteredEvents = useMutation({
    mutationFn: async (filter: EventFilter) => {
      const filterObject: {
        tag_filter?: { tags: string[] };
        date_filter?: { year: number };
        viewport: { north: number; south: number; east: number; west: number };
        max_level?: number;
        zoom_level?: number;
      } = {
        viewport: filter.viewport,
      };

      const tags: string[] = [];

      if (filter.period) {
        tags.push(filter.period);
      }

      if (filter.types.length > 0) {
        tags.push(...filter.types);
      }

      if (tags.length > 0) {
        filterObject.tag_filter = { tags };
      }

      filterObject.date_filter = { year: filter.year };

      if (filter.zoom !== undefined) {
        filterObject.zoom_level = filter.zoom;
        filterObject.max_level = Math.min(
          3,
          Math.max(1, Math.floor(filter.zoom / 5))
        );
      } else {
        filterObject.max_level = 4;
      }

      console.log("Request URL:", "/api/clusters/hierarchical");
      console.log("Filter Object:", JSON.stringify(filterObject, null, 2));

      try {
        const response = await api.post<ClusterResponse>(
          "/api/clusters/hierarchical",
          filterObject
        );

        console.log("Full API response:", response.data);

        const clusters = response.data.data;
        console.log("Clusters:", clusters);

        if (clusters.length > 0) {
          console.log("Events in first cluster:", clusters[0].events);
        }

        // ตรวจว่าข้อมูลถูกต้อง
        if (!Array.isArray(clusters)) {
          throw new Error(
            "Clusters data is missing or invalid in the API response"
          );
        }

        /// แปลง clusters ทีละตัว
        return clusters.map((cluster) => {
          const bounds = calculateClusterBounds(cluster);
          const timeSpan = calculateTimeSpan(cluster);

          return {
            ...cluster,
            point_count: cluster.event_ids.length,
            radius: bounds.area
              ? Math.sqrt((cluster.event_ids.length * bounds.area) / Math.PI) *
                50
              : Math.sqrt(cluster.event_ids.length) * 50,
            bounds,
            time_span: timeSpan,
            is_fully_visible: isClusterFullyInViewport(
              cluster,
              filter.viewport
            ),
            is_partially_visible: isClusterPartiallyInViewport(
              cluster,
              filter.viewport
            ),
            events: cluster.events ?? [], // ⭐️ รวม events ด้วย
          };
        });
      } catch (error) {
        throw new Error(`Failed to fetch clusters: ${error}`);
      }
    },
  });

  const getLatLonDate = useMutation({
    mutationFn: async (params: { lat: number; lon: number; date: string }) => {
      const url = `/api/events/lat-lon-date?lat=${params.lat}&lon=${params.lon}&date=${params.date}`;

      console.log("Location Request URL:", url);
      console.log("Location Params:", params);

      try {
        const response = await api.get(url);
        console.log("API Response Data:", response.data);
        return response.data as HistoricalEvent[];
      } catch (error) {
        throw new Error(`Failed to fetch events by location: ${error}`);
      }
    },
  });

  return {
    getFilteredEvents,
    getLatLonDate,
  };
};
