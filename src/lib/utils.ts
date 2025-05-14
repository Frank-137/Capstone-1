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
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  // Use 3D projection calculation
  const x = Math.cos(phi) * Math.cos(theta);
  const y = Math.cos(phi) * Math.sin(theta);
  const z = Math.sin(phi);
  
  const container = document.querySelector('canvas')?.parentElement;
  if (!container) return { x: 0, y: 0, visible: false };
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Adjust scale factor
  const scale = Math.min(width, height) * 0.4;
  
  const screenX = centerX + x * scale;
  const screenY = centerY + y * scale;
  
  // Improved visibility check
  const visible = z > -0.1; // Point is visible when on the front side
  
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
