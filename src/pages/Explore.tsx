import React, { useState, useEffect } from 'react';
import NavBar from '@/components/NavBar';
import Globe from '@/components/Globe';
import Timeline from '@/components/Timeline';
import EventDetails from '@/components/EventDetails';
import FilterPanel from '@/components/FilterPanel';
import RelationshipGraph from '@/components/RelationshipGraph';
import { HistoricalEvent } from '@/lib/types';
import { historicalEvents, getEventsByPeriod, getEventsByYear, getYearRange } from '@/data/events';
import { createRelationshipGraph } from '@/data/relationships';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Sparkles, Share2 } from 'lucide-react';

const Explore = () => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<HistoricalEvent[]>(historicalEvents);
  const [activePeriod, setActivePeriod] = useState<string | null>(null);
  const [activeEventTypes, setActiveEventTypes] = useState<string[]>(['battle', 'treaty', 'political', 'economic']);
  const [selectedYear, setSelectedYear] = useState<number>(getYearRange().min);
  const [yearEvents, setYearEvents] = useState<HistoricalEvent[]>(getEventsByYear(selectedYear));
  const [relationshipGraph, setRelationshipGraph] = useState(() => createRelationshipGraph());
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'map' | 'timeline'>('map');
  const [showSparkle, setShowSparkle] = useState(false);
  
  // Apply filters when period or event types change
  useEffect(() => {
    // First filter by period
    let events = getEventsByPeriod(activePeriod);
    
    // Then filter by event types
    if (activeEventTypes.length > 0) {
      events = events.filter(event => activeEventTypes.includes(event.type));
    }
    
    setFilteredEvents(events);
  }, [activePeriod, activeEventTypes]);
  
  // Handle period filter change
  const handlePeriodChange = (period: string | null) => {
    setActivePeriod(period);
  };
  
  // Handle event type filter change
  const handleEventTypeChange = (type: string) => {
    setActiveEventTypes(prev => {
      // If type is already active, remove it
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      } 
      // Otherwise add it
      return [...prev, type];
    });
  };
  
  // Handle year change from the timeline
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };
  
  // Handle events change from the timeline
  const handleEventsChange = (events: HistoricalEvent[]) => {
    setYearEvents(events);
  };
  
  // Handle selecting an event
  const handleSelectEvent = (event: HistoricalEvent) => {
    setSelectedEvent(event);
  };
  
  // Toggle relationship graph view
  const toggleGraphView = () => {
    setShowGraph(!showGraph);
    setShowSparkle(true);
    setTimeout(() => setShowSparkle(false), 1200);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      {/* Animated Gradient Background */}
      <div className="fixed inset-0 -z-10 animate-gradient-x bg-gradient-to-br from-blue-900 via-pink-700 to-yellow-400 opacity-20 blur-2xl" />
      <NavBar />
      
      <main className="flex-1 mt-16 container mx-auto px-2 sm:px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">
                History Explorer
              </h2>
              <p className="text-sm text-foreground/70 mb-4">
                Explore historical events across time and space.
              </p>
              <FilterPanel 
                activePeriod={activePeriod}
                onPeriodChange={handlePeriodChange}
                activeEventTypes={activeEventTypes}
                onEventTypeChange={handleEventTypeChange}
              />
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* View mode toggle */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <Tabs defaultValue="map" className="w-full sm:w-[400px]" onValueChange={(value) => setViewMode(value as 'map' | 'timeline')}>
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleGraphView}
                className="w-full sm:w-auto transition-transform duration-200 hover:scale-105 shadow hover:shadow-xl flex items-center gap-2"
              >
                <Share2 className="w-4 h-4 text-pink-400 animate-wiggle" />
                {showGraph ? 'Hide Relationships' : 'Show Relationships'}
              </Button>
              {showSparkle && (
                <Sparkles className="w-10 h-10 text-yellow-300 absolute right-8 top-0 animate-bounce" />
              )}
            </div>
            
            {/* Main visualization */}
            <div className="relative min-h-[300px] flex items-center justify-center" style={{ height: '60vh' }}>
              {/* Gray gradient background behind the glass-panel */}
              <div className="absolute inset-0 z-0 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 opacity-80" />
              <div className="relative z-10 w-full h-full glass-panel border-none rounded-xl overflow-hidden flex flex-col">
                {viewMode === 'map' && (
                  <Globe 
                    events={historicalEvents}
                    onSelectEvent={handleSelectEvent}
                    selectedEvent={selectedEvent}
                  />
                )}
                {viewMode === 'timeline' && (
                  <div className="p-2 sm:p-6 h-full overflow-y-auto">
                    <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">Events Timeline</h3>
                    <div className="space-y-8">
                      {filteredEvents
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map(event => (
                          <div 
                            key={event.id} 
                            className={`relative pl-8 border-l-2 transition-shadow hover:shadow-lg ${selectedEvent?.id === event.id ? 'border-primary bg-blue-900/10' : 'border-foreground/20'}`}
                          >
                            <div 
                              className={`absolute left-[-8px] top-0 w-4 h-4 rounded-full ${selectedEvent?.id === event.id ? 'bg-primary animate-bounce-x' : 'bg-foreground/20'}`}
                              onClick={() => handleSelectEvent(event)}
                            ></div>
                            <div className="mb-1 text-sm text-foreground/60">
                              {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <h4 className="text-lg font-bold mb-1 hover:text-primary cursor-pointer" onClick={() => handleSelectEvent(event)}>
                              {event.title}
                            </h4>
                            <div className="text-sm">{event.description.substring(0, 120)}...</div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
                {/* Relationship graph overlay */}
                {showGraph && (
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-md z-20 p-4 overflow-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
                      <h3 className="text-xl font-bold flex items-center gap-2 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">
                        <Sparkles className="w-6 h-6 text-yellow-300 animate-bounce" /> Event Relationships
                      </h3>
                      <Button variant="ghost" size="sm" onClick={toggleGraphView}>
                        ×
                      </Button>
                    </div>
                    <div className="h-[calc(100%-50px)] min-h-[200px]">
                      <RelationshipGraph 
                        graph={relationshipGraph} 
                        onSelectEvent={handleSelectEvent}
                        selectedEventId={selectedEvent?.id || null}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Timeline slider */}
            <Timeline 
              onYearChange={handleYearChange}
              onEventsChange={handleEventsChange}
              selectedYear={selectedYear}
            />
          </div>
          
          {/* Right sidebar - Event details */}
          <div className="w-full lg:w-96 flex-shrink-0">
            {selectedEvent ? (
              <EventDetails 
                event={selectedEvent}
                onClose={() => setSelectedEvent(null)}
                onSelectEvent={setSelectedEvent}
              />
            ) : (
              <div className="h-full glass-panel p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-foreground/30 mb-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">No Event Selected</h3>
                <p className="text-foreground/70">
                  Click on an event pin on the globe or select from the timeline to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-foreground/50">
            <p>© 2025 Globes of History. Educational platform for interactive historical exploration.</p>
            <p className="mt-2">
              <Link to="/" className="underline hover:text-foreground/80">Home</Link>
              <span className="mx-2">•</span>
              <Link to="/about" className="underline hover:text-foreground/80">About</Link>
              <span className="mx-2">•</span>
              <Link to="/about#contact" className="underline hover:text-foreground/80">Contact</Link>
            </p>
          </div>
        </div>
      </footer>
      {/* Keyframes for playful animations */}
      <style>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease-in-out infinite;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(8px); }
        }
        .animate-bounce-x {
          animation: bounce-x 1.2s infinite;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-8deg); }
          50% { transform: rotate(8deg); }
        }
        .animate-wiggle {
          animation: wiggle 1.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default Explore;
