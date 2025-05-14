import React, { useRef, useState, useEffect } from 'react';
import { HistoricalEvent } from '@/lib/types';
import { convertGeoToScreenCoord } from '@/lib/utils';

interface EventPinProps {
  event: HistoricalEvent;
  onClick: () => void;
  isSelected: boolean;
}

const EventPin: React.FC<EventPinProps> = ({ event, onClick, isSelected }) => {
  const pinRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: -1000, y: -1000, visible: false });
  const lastUpdateRef = useRef<number>(0);
  
  // Update pin position when the globe rotates
  useEffect(() => {
    const updatePosition = () => {
      if (!pinRef.current) return;
      
      const { lat, lng } = event.location;
      const coord = convertGeoToScreenCoord(lat, lng);
      
      // Add debounce to reduce frequent updates
      if (Math.abs(position.x - coord.x) > 1 || Math.abs(position.y - coord.y) > 1) {
        setPosition({
          x: coord.x,
          y: coord.y,
          visible: coord.visible
        });
      }
    };
    
    // Initial position
    updatePosition();
    
    // Update position with debounce
    let animationFrameId: number;
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdateRef.current > 16) { // ~60fps
        updatePosition();
        lastUpdateRef.current = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [event.location, position.x, position.y]);
  
  if (!position.visible) return null;
  
  return (
    <div 
      ref={pinRef}
      className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all duration-200 transform -translate-x-1/2 -translate-y-1/2 ${
        isSelected ? 'z-30 scale-150' : 'z-20'
      }`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        backgroundColor: getPinColor(event.type),
        boxShadow: isSelected 
          ? '0 0 10px 2px rgba(255, 255, 255, 0.7)' 
          : '0 0 5px 1px rgba(0, 0, 0, 0.3)'
      }}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-white"></div>
          <div className="bg-white text-black text-xs font-medium py-1 px-2 rounded whitespace-nowrap shadow-lg">
            {event.title}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get pin color based on event type
function getPinColor(type: string): string {
  switch (type) {
    case 'battles':
      return '#dc2626'; // red-600
    case 'attacks':
      return '#ea580c'; // orange-600
    case 'agreements':
      return '#2563eb'; // blue-600
    case 'conferences':
      return '#7c3aed'; // purple-600
    case 'declarations':
      return '#0891b2'; // cyan-600
    case 'invasions':
      return '#ca8a04'; // yellow-600
    case 'developments':
      return '#16a34a'; // green-600
    case 'assassinations':
      return '#be123c'; // rose-600
    case 'mutinies':
      return '#db2777'; // pink-600
    case 'operations':
      return '#0d9488'; // teal-600
    case 'surrender':
    case 'surrenders':
      return '#6b7280'; // gray-500
    case 'threats':
      return '#d97706'; // amber-600
    case 'trials':
      return '#0284c7'; // sky-600
    case 'uprisings':
      return '#be185d'; // pink-700
    default:
      return '#6b7280'; // gray-500
  }
}

export default EventPin;
