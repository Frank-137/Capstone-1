
import React, { useState, useEffect, useRef } from 'react';
import { Slider } from '@/components/ui/slider';
import { getYearRange, getEventsByYear } from '@/data/events';
import { HistoricalEvent } from '@/lib/types';

interface TimelineProps {
  onYearChange: (year: number) => void;
  onEventsChange: (events: HistoricalEvent[]) => void;
  selectedYear: number;
}

const Timeline: React.FC<TimelineProps> = ({ onYearChange, onEventsChange, selectedYear }) => {
  const yearRange = getYearRange();
  const [year, setYear] = useState(selectedYear || yearRange.min);
  const [isPlaying, setIsPlaying] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Generate years for the timeline
  const years = [];
  for (let i = yearRange.min; i <= yearRange.max; i++) {
    years.push(i);
  }

  // Handle year change
  const handleYearChange = (newYear: number[]) => {
    setYear(newYear[0]);
    onYearChange(newYear[0]);
    
    // Update events for the selected year
    const yearEvents = getEventsByYear(newYear[0]);
    onEventsChange(yearEvents);
  };
  
  // Toggle play/pause timeline animation
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Auto-play effect
  useEffect(() => {
    // Clear any existing interval
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    
    // If playing, advance the year every 2 seconds
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setYear(currentYear => {
          const nextYear = currentYear + 1;
          
          // If we reach the end, stop playing
          if (nextYear > yearRange.max) {
            setIsPlaying(false);
            return currentYear;
          }
          
          // Update events for the new year
          const yearEvents = getEventsByYear(nextYear);
          onEventsChange(yearEvents);
          onYearChange(nextYear);
          
          return nextYear;
        });
      }, 2000);
    }
    
    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying, onEventsChange, onYearChange, yearRange.max]);

  return (
    <div className="w-full glass-panel p-6" ref={timelineRef}>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-medium">Timeline: {year}</h3>
        <button
          onClick={togglePlay}
          className="px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      
      <div className="relative mb-6">
        <Slider
          value={[year]}
          min={yearRange.min}
          max={yearRange.max}
          step={1}
          onValueChange={handleYearChange}
        />
      </div>
      
      <div className="relative h-8 w-full overflow-x-auto">
        <div className="absolute top-0 left-0 right-0 h-full">
          {years.map((y, i) => (
            <React.Fragment key={y}>
              <div 
                className="timeline-tick" 
                style={{ left: `${(i / (years.length - 1)) * 100}%` }}
              />
              {y % 5 === 0 && (
                <div 
                  className="timeline-year"
                  style={{ left: `${(i / (years.length - 1)) * 100}%` }}
                >
                  {y}
                </div>
              )}
            </React.Fragment>
          ))}
          
          {/* Event markers on timeline */}
          {years.map((y, i) => {
            const yearEvents = getEventsByYear(y);
            if (yearEvents.length === 0) return null;
            
            return (
              <div
                key={`event-${y}`}
                className={`absolute w-2 h-2 rounded-full ${y === year ? 'bg-white' : 'bg-white/50'} transform -translate-x-1/2`}
                style={{ 
                  left: `${(i / (years.length - 1)) * 100}%`,
                  bottom: '0px'
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
