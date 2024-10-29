import { useState } from "preact/hooks";
import EventCard from "../components/EventCard.tsx";
import { sanitizeEventData, sanitizeGitHubWebhookEvent } from "../utils/sanitizeData.ts";
import { Button } from "../components/Button.tsx";

type Event = {
  id: string;
  eventType: string;
  payload: string;
};

type EventListProps = {
  initialEvents: Event[];
};

const eventTypeStyles = {
  push: "bg-green-50 border-green-300 text-green-900",
  pull_request: "bg-blue-50 border-blue-300 text-blue-900",
  issues: "bg-yellow-50 border-yellow-300 text-yellow-900",
  fork: "bg-purple-50 border-purple-300 text-purple-900",
  star: "bg-red-50 border-red-300 text-red-900",
  default: "bg-gray-50 border-gray-300 text-gray-900"
};

export default function EventList({ initialEvents }: EventListProps) {
  const [events, setEvents] = useState(initialEvents);

  const deleteEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/webhook/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error(await res.text());

      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      alert(`Failed to delete event: ${error.message}`);
    }
  };

  const parseAndSanitizeEvent = (payload: string) => {
    try {
      const event = JSON.parse(payload);
      switch (event.type) {
        case "push":
        case "pull_request":
        case "issues":
        case "fork":
        case "star":
          return sanitizeGitHubWebhookEvent(event);
        default:
          return sanitizeEventData(event);
      }
    } catch (error) {
      console.error("Failed to parse event payload:", error);
      return null;
    }
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.length > 0 ? (
        events.map((event) => {
          const eventData = parseAndSanitizeEvent(event.payload);
          if (!eventData) return null;

          const eventStyle = eventTypeStyles[event.eventType] || eventTypeStyles.default;

          return (
            <div key={event.id} class={`relative border-l-4 p-4 rounded-md shadow-sm ${eventStyle}`}>
              <EventCard
                eventType={event.eventType}
                eventData={eventData}
              />
              <Button
                onClick={() => deleteEvent(event.id)}
                aria-label="Delete Event"
                class="absolute top-2 right-2 hover:bg-red-500 hover:text-white transition-colors duration-200"
              >
                DELETE
              </Button>
            </div>
          );
        })
      ) : (
        <p class="text-gray-500">No events found.</p>
      )}
    </div>
  );
}