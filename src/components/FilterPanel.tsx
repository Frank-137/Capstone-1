import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { WarPeriod, EventType } from "@/lib/types";

interface FilterPanelProps {
  activePeriod: WarPeriod | null;
  onPeriodChange: (period: WarPeriod | null) => void;
  activeEventTypes: EventType[];
  onEventTypeChange: (type: EventType) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  activePeriod,
  onPeriodChange,
  activeEventTypes,
  onEventTypeChange,
}) => {
  const periods: { id: WarPeriod; label: string }[] = [
    { id: "wwi", label: "World War I" },
    { id: "wwii", label: "World War II" },
  ];

  const eventTypes: { id: EventType; label: string }[] = [
    { id: "attacks", label: "Attacks" },
    { id: "agreements", label: "Agreements" },
    { id: "assassinations", label: "Assassinations" },
    { id: "battles", label: "Battles" },
    { id: "conferences", label: "Conferences" },
    { id: "invasions", label: "Invasions" },
    { id: "declarations", label: "Declarations" },
    { id: "mutinies", label: "Mutinies" },
    { id: "developments", label: "Developments" },
    { id: "threats", label: "Threats" },
    { id: "operations", label: "Operations" },
    { id: "surrender", label: "Surrender" },
    { id: "surrenders", label: "Surrenders" },
    { id: "uprisings", label: "Uprisings" },
    { id: "trials", label: "Trials" },
  ];

  const getEventTypeColor = (type: EventType): string => {
    switch (type) {
      case 'agreements':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'assassinations':
        return 'bg-red-500 hover:bg-red-600';
      case 'attacks':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'battles':
        return 'bg-red-600 hover:bg-red-700';
      case 'conferences':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'declarations':
        return 'bg-indigo-500 hover:bg-indigo-600';
      case 'developments':
        return 'bg-green-500 hover:bg-green-600';
      case 'invasions':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'mutinies':
        return 'bg-pink-500 hover:bg-pink-600';
      case 'operations':
        return 'bg-teal-500 hover:bg-teal-600';
      case 'surrender':
        return 'bg-gray-500 hover:bg-gray-600';
      case 'surrenders':
        return 'bg-gray-600 hover:bg-gray-700';
      case 'threats':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'trials':
        return 'bg-cyan-500 hover:bg-cyan-600';
      case 'uprisings':
        return 'bg-rose-500 hover:bg-rose-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="w-full glass-panel p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-4 w-4" />
        <h3 className="text-lg font-medium">Filters</h3>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2 text-foreground/70">
          Time Period
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activePeriod === null ? "default" : "outline"}
            size="sm"
            onClick={() => onPeriodChange(null)}
          >
            All
          </Button>
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={activePeriod === period.id ? "default" : "outline"}
              size="sm"
              onClick={() => onPeriodChange(period.id)}
              className={
                activePeriod === period.id
                  ? period.id === "wwi"
                    ? "bg-blue-600 text-white" 
                    : period.id === "wwii"
                    ? "bg-red-600 text-white" 
                    : "bg-gray-600 text-white" 
                  : ""
              }
            >
              {period.label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2 text-foreground/70">
          Event Types
        </h4>
        <div className="flex flex-wrap gap-2">
          {eventTypes.map((type) => (
            <Button
              key={type.id}
              variant={activeEventTypes.includes(type.id) ? "default" : "outline"}
              size="sm"
              onClick={() => onEventTypeChange(type.id)}
              className={
                activeEventTypes.includes(type.id)
                  ? `${getEventTypeColor(type.id)} text-white border-none`
                  : ""
              }
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