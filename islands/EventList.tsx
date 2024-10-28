import { useState } from "preact/hooks";
import EventCard from "../components/EventCard.tsx";
import { sanitizeEventData } from "../utils/sanitizeData.ts";
import { Button } from "../components/Button.tsx";

type Event = {
  id: string;
  eventType: string;
  payload: string;
};

type EventListProps = {
  initialEvents: Event[];
};

export default function EventList({ initialEvents }: EventListProps) {
  const [events, setEvents] = useState(initialEvents);

  const deleteEvent = async (eventId: string) => {
    const res = await fetch(`/api/webhook/${eventId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setEvents(events.filter((event) => event.id !== eventId));
    } else {
      const errorText = await res.text();
      alert(`Failed to delete event: ${errorText}`);
    }
  };

  const parseAndSanitizeEvent = (payload: string) => {
    try {
      return sanitizeEventData(JSON.parse(payload));
    } catch (error) {
      console.error("Failed to parse event payload:", error);
      return null;
    }
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.length > 0
        ? (
          events.map((event) => {
            const eventData = parseAndSanitizeEvent(event.payload);
            if (!eventData) return null;

            return (
              <div key={event.id} class="relative">
                <EventCard
                  eventType={event.eventType}
                  eventData={eventData}
                />
                <Button
                  onClick={() => deleteEvent(event.id)}
                  aria-label="Delete Event"
                >
                  ✕
                </Button>
              </div>
            );
          })
        )
        : <p>No events found.</p>}
    </div>
  );
}
