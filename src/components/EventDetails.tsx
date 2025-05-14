import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HistoricalEvent } from "@/lib/types";
import { getRelatedEvents } from "@/data/relationships";
import { formatDate } from "@/lib/utils";

interface EventDetailsProps {
  event: HistoricalEvent | null;
  onClose: () => void;
  onSelectEvent: (event: HistoricalEvent) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({
  event,
  onClose,
  onSelectEvent,
}) => {
  if (!event) return null;

  const relatedEvents = getRelatedEvents(event.id);

  const getPeriodColor = () => {
    switch (event.period) {
      case "wwi":
        return "bg-war-ww1 text-white";
      case "wwii":
        return "bg-war-ww2 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="w-full glass-panel border-none">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl md:text-2xl">{event.title}</CardTitle>
            <CardDescription>{formatDate(event.date)}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={getPeriodColor()}>
            {event.period === "wwi"
              ? "World War I"
              : event.period === "wwii"
              ? "World War II"
              : ""}
          </Badge>
        </div>
        {/* Add this block to show tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {event.tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] md:h-[300px] pr-4">
          {event.imageUrl && (
            <div className="mb-4">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-40 md:h-60 object-cover rounded-md"
              />
            </div>
          )}
          <p className="text-sm md:text-base leading-relaxed">
            {event.description}
          </p>

          {relatedEvents.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-2">Related Events:</h4>
              <div className="space-y-2">
                {relatedEvents.map((relatedEvent) => (
                  <button
                    key={relatedEvent.id}
                    onClick={() => onSelectEvent(relatedEvent)}
                    className="w-full text-left p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
                  >
                    <span>{relatedEvent.title}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(relatedEvent.date, true)}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between border-t border-white/10 pt-4">
        <div className="text-xs text-muted-foreground">
          Location: {event.location.lat.toFixed(2)}°,{" "}
          {event.location.lng.toFixed(2)}°
        </div>
        <Button variant="secondary" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventDetails;
