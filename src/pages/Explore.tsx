import React, { useState, useEffect, useCallback } from "react";
import NavBar from "@/components/NavBar";
import Globe from "@/components/Globe";
import Timeline from "@/components/Timeline";
import EventDetails from "@/components/EventDetails";
import FilterPanel from "@/components/FilterPanel";
import { HistoricalEvent, WarPeriod, EventType } from "@/lib/types";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Sparkles, Share2 } from "lucide-react";
import { createRelationshipGraph } from "@/data/relationships";
import debounce from 'lodash/debounce';

const Explore = () => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalEvent | null>(
    null
  );
  const [filteredEvents, setFilteredEvents] = useState<HistoricalEvent[]>([]);
  const [activePeriod, setActivePeriod] = useState<WarPeriod | null>(null);
  const [activeEventTypes, setActiveEventTypes] = useState<EventType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(); // Default undefined
  const [yearEvents, setYearEvents] = useState<HistoricalEvent[]>([]);
  const [viewMode, setViewMode] = useState<"map" | "timeline">("map");
  const [viewport, setViewport] = useState({
    north: 80,
    south: 20,
    east: 60,
    west: -40
  });
  

  const { getFilteredEvents } = useEvents();

  // สร้าง debounced version ของ handleViewportChange
  const debouncedViewportChange = useCallback(
    debounce((newViewport: {
      north: number;
      south: number;
      east: number;
      west: number;
    }) => {
      console.log('Viewport changed (debounced):', newViewport);
      setViewport(newViewport);
    }, 50),
    []
  );

  // Apply filters when period or event types change
  useEffect(() => {
    const fetchFilteredEvents = async () => {
      try {
        console.log("🔄 Fetching events with filters:", {
          period: activePeriod,
          types: activeEventTypes,
          year: selectedYear,
          viewport: viewport,
        });

        // สร้าง filter object แบบ dynamic
        const filter: any = {
          period: activePeriod,
          types: activeEventTypes,
        };
        if (selectedYear !== undefined) {
          filter.year = selectedYear;
        }
        if (viewport) {
          filter.viewport = viewport;
        }

        const events = await getFilteredEvents.mutateAsync(filter);
        const eventArray = Array.isArray(events)
          ? events
          : events &&
            typeof events === "object" &&
            "data" in events &&
            Array.isArray((events as any).data)
          ? (events as any).data
          : [];

        console.log("📦 Final eventArray (before mapping):", eventArray);
          
        setFilteredEvents(
          eventArray.map((e: any) => {
            // Split all tags by comma and trim
            const rawTags = Array.isArray(e.tags) ? e.tags : [];
            const allTags = rawTags
              .flatMap((tagStr) => tagStr.split(","))
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0);
        
            const eventTypeList: EventType[] = [
              "agreements",
              "assassinations",
              "attacks",
              "battles",
              "conferences",
              "declarations",
              "developments",
              "invasions",
              "mutinies",
              "operations",
              "surrender",
              "surrenders",
              "threats",
              "trials",
              "uprisings",
            ];
            const eventType =
              (allTags.find((tag) =>
                eventTypeList.includes(tag)
              ) as EventType) || "";
            const period = allTags.includes("ww2") ? "ww2" : "ww1";
        
            return {
              id: String(e.event_id),
              title: e.event_name,
              description: e.description || "",
              date: new Date(e.date),
              location: { 
                lat: Number(e.lat),   // <-- แปลงเป็นตัวเลข
                lng: Number(e.lon)    // <-- แปลงเป็นตัวเลข
              },
              lat: Number(e.lat),     // <-- แปลงเป็นตัวเลข
              lon: Number(e.lon),     // <-- แปลงเป็นตัวเลข
              type: eventType,
              period: period,
              tags: allTags,
              countryCode: undefined,
              imageUrl: e.image || "",
            };
          })
        );
      } catch (error) {
        console.error("❌ Error fetching filtered events:", error);
      }
    };

    fetchFilteredEvents();
  }, [activePeriod, activeEventTypes, selectedYear, viewport]);

  // Handle period filter change
  const handlePeriodChange = (period: WarPeriod | null) => {
    console.log("📅 Period changed:", period);
    setActivePeriod(period);
  };

  // Handle event type filter change
  const handleEventTypeChange = (type: EventType) => {
    setActiveEventTypes((prev) => {
      const newTypes = prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type];

      console.log("🔍 Event types updated:", {
        type,
        action: prev.includes(type) ? "removed" : "added",
        currentTypes: newTypes,
      });

      return newTypes;
    });
  };

  // Handle year change from the timeline
  const handleYearChange = (year: number) => {
    console.log("📆 Year changed:", year);
    setSelectedYear(year);
  };

  // Handle events change from the timeline
  const handleEventsChange = (events: HistoricalEvent[]) => {
    console.log("📊 Timeline events updated:", events.length, "events");
    setYearEvents(events);
  };

  // Handle selecting an event
  const handleSelectEvent = (event: HistoricalEvent) => {
    console.log("🎯 Event selected:", {
      id: event.id,
      title: event.title,
      type: event.type,
      date: event.date,
    });
    setSelectedEvent(event);
  };

  // Handle viewport change from Globe
  const handleViewportChange = (newViewport: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    debouncedViewportChange(newViewport);
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
              <Tabs
                defaultValue="map"
                className="w-full sm:w-[400px]"
                onValueChange={(value) =>
                  setViewMode(value as "map" | "timeline")
                }
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="map">Map View</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Main visualization */}
            <div
              className="relative min-h-[300px] flex items-center justify-center"
              style={{ height: "60vh" }}
            >
              {/* Gray gradient background behind the glass-panel */}
              <div className="absolute inset-0 z-0 rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-700 opacity-80" />
              <div className="relative z-10 w-full h-full glass-panel border-none rounded-xl overflow-hidden flex flex-col">
                {viewMode === "map" ? (
                  <Globe
                    events={filteredEvents}
                    onSelectEvent={handleSelectEvent}
                    selectedEvent={selectedEvent}
                    onViewportChange={handleViewportChange}
                  />
                ) : viewMode === "timeline" ? (
                  <div className="p-2 sm:p-6 h-full overflow-y-auto">
                    <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">
                      Events Timeline
                    </h3>

                    <div className="space-y-8">
                      {filteredEvents
                        .sort(
                          (a, b) =>
                            new Date(a.date).getTime() -
                            new Date(b.date).getTime()
                        )
                        .map((event) => (
                          <div
                            key={event.id}
                            className={`relative pl-8 border-l-2 transition-shadow hover:shadow-lg ${
                              selectedEvent?.id === event.id
                                ? "border-primary bg-blue-900/10"
                                : "border-foreground/20"
                            }`}
                          >
                            <div
                              className={`absolute left-[-8px] top-0 w-4 h-4 rounded-full ${
                                selectedEvent?.id === event.id
                                  ? "bg-primary animate-bounce-x"
                                  : "bg-foreground/20"
                              }`}
                              onClick={() => handleSelectEvent(event)}
                            ></div>
                            <div className="mb-1 text-sm text-foreground/60">
                              {new Date(event.date).toLocaleDateString(
                                "us-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </div>
                            <h4
                              className="text-lg font-bold mb-1 hover:text-primary cursor-pointer"
                              onClick={() => handleSelectEvent(event)}
                            >
                              {event.title}
                            </h4>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : null}
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-foreground/30 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium mb-2 bg-gradient-to-r from-blue-200 via-pink-200 to-yellow-200 bg-clip-text text-transparent animate-gradient-x">
                  No Event Selected
                </h3>
                <p className="text-foreground/70">
                  Click on an event pin on the globe or select from the timeline
                  to view details.
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
            <p>
              © 2025 Globes of History. Educational platform for interactive
              historical exploration.
            </p>
            <p className="mt-2">
              <Link to="/" className="underline hover:text-foreground/80">
                Home
              </Link>
              <span className="mx-2">•</span>
              <Link to="/about" className="underline hover:text-foreground/80">
                About
              </Link>
              <span className="mx-2">•</span>
              <Link
                to="/about#contact"
                className="underline hover:text-foreground/80"
              >
                Contact
              </Link>
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
