
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
  
  // Update pin position when the globe rotates
  useEffect(() => {
    const updatePosition = () => {
      if (!pinRef.current) return;
      
      const { lat, lng } = event.location;
      const coord = convertGeoToScreenCoord(lat, lng);
      
      // Only show the pin if it's on the visible side of the globe
      if (coord.visible) {
        setPosition({
          x: coord.x,
          y: coord.y,
          visible: true
        });
      } else {
        setPosition({
          x: coord.x,
          y: coord.y,
          visible: false
        });
      }
    };
    
    // Initial position
    updatePosition();
    
    // Update position on animation frame
    let animationFrameId: number;
    const animate = () => {
      updatePosition();
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [event.location]);
  
  if (!position.visible) return null;
  
  return (
    <div 
      ref={pinRef}
      className={`event-pin event-pin-${event.type} ${isSelected ? 'z-30 scale-150' : 'z-20'}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        boxShadow: isSelected ? '0 0 10px 2px rgba(255, 255, 255, 0.7)' : 'none'
      }}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-white"></div>
          <div className="bg-white text-black text-xs font-medium py-1 px-2 rounded whitespace-nowrap">
            {event.title}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventPin;
