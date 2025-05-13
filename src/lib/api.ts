import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // เพิ่มตัวเลือกนี้เพื่อรองรับ CORS
});

// API endpoints
export const endpoints = {
  // Event endpoints
  events: {
    getLatLonDate: '/api/events-lat-lon-date',
    getFiltered: '/api/events/filter',
  },
  // Cluster endpoints
  clusters: {
    insert: '/api/insert-clusters',
    getHierarchical: '/api/clusters/hierarchical',
  },
  // Python service endpoints
  process: {
    processEvent: '/api/process',
  },
};

export default api; 