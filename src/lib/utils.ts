
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date for display
export function formatDate(date: Date, short: boolean = false): string {
  if (short) {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short'
    });
  }
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Convert geographical coordinates to screen coordinates
export function convertGeoToScreenCoord(lat: number, lng: number) {
  // Implementation is a simplified version just for demonstration
  // In a real app, this would use the globe's actual projection and orientation
  
  const phi = (90 - lat) * (Math.PI / 180); // Convert to radians
  const theta = (lng + 180) * (Math.PI / 180);
  
  // Simulate 3D to 2D projection
  // In a real implementation, this would use the actual 3D globe's projection
  const x = -Math.sin(phi) * Math.cos(theta);
  const z = Math.sin(phi) * Math.sin(theta);
  
  // Get the container dimensions
  const container = document.querySelector('canvas')?.parentElement;
  if (!container) return { x: 0, y: 0, visible: false };
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Convert to screen coordinates
  const screenX = centerX + x * (width * 0.45);
  const screenY = centerY + z * (height * 0.45);
  
  // Check if the point is on the visible side of the globe
  // This is a simplified check - in a real app it would be more complex
  const visible = Math.sin(phi) * Math.cos(theta) <= 0.2;
  
  return { x: screenX, y: screenY, visible };
}

// Parse URL parameters
export function getUrlParams() {
  const searchParams = new URLSearchParams(window.location.search);
  const params: Record<string, string> = {};
  
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  
  return params;
}

// Generate a unique ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
