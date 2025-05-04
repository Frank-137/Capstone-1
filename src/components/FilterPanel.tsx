import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface FilterPanelProps {
  activePeriod: string | null;
  onPeriodChange: (period: string | null) => void;
  activeEventTypes: string[];
  onEventTypeChange: (type: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  activePeriod,
  onPeriodChange,
  activeEventTypes,
  onEventTypeChange,
}) => {
  const periods = [
    { id: 'ww1', label: 'World War I' },
    { id: 'interwar', label: 'Interwar' },
    { id: 'ww2', label: 'World War II' },
  ];
  
  const eventTypes = [
    { id: 'battle', label: 'Battles' },
    { id: 'treaty', label: 'Treaties' },
    { id: 'political', label: 'Political' },
    { id: 'economic', label: 'Economic' },
  ];
  
  return (
    <div className="w-full glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="text-lg font-medium">Filters</h3>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 text-foreground/70">Time Period</h4>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activePeriod === null ? "default" : "outline"}
            size="sm"
            onClick={() => onPeriodChange(null)}
          >
            All
          </Button>
          {periods.map(period => (
            <Button
              key={period.id}
              variant={activePeriod === period.id ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(period.id)}
              className={
                activePeriod === period.id
                  ? (period.id === 'ww1'
                      ? 'bg-war-ww1 hover:bg-war-ww1/90'
                      : period.id === 'interwar'
                        ? 'bg-war-interwar hover:bg-war-interwar/90'
                        : `bg-war-${period.id} hover:bg-war-${period.id}/90`)
                  : ''
              }
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2 text-foreground/70">Event Types</h4>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map(type => (
            <Button
              key={type.id}
              variant={activeEventTypes.includes(type.id) ? "default" : "outline"}
              size="sm"
              onClick={() => onEventTypeChange(type.id)}
              className={activeEventTypes.includes(type.id) ? `bg-globe-event-${type.id} hover:bg-globe-event-${type.id}/90` : ''}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
