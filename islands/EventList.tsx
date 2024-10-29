import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import EventCard from "../components/EventCard.tsx";
import { sanitizeEventData } from "../utils/sanitizeData.ts";
import { Button } from "../components/Button.tsx";

type EventType = "push" | "pull_request" | "issues" | "fork" | "star" | "default";

type Event = {
  id: string;
  eventType: EventType;
  payload: string;
};

type EventListProps = {
  initialEvents: Event[];
};


const eventTypeStyles: Record<EventType, string> = {
  push: "bg-green-50 border-green-300 text-green-900",
  pull_request: "bg-blue-50 border-blue-300 text-blue-900",
  issues: "bg-yellow-50 border-yellow-300 text-yellow-900",
  fork: "bg-purple-50 border-purple-300 text-purple-900",
  star: "bg-red-50 border-red-300 text-red-900",
  default: "bg-gray-50 border-gray-300 text-gray-900",
};


const getEventStyle = (eventType: EventType) =>
  eventTypeStyles[eventType] || eventTypeStyles.default;

export const handler: Handlers = {
  async DELETE(req, ctx) {
    const eventId = ctx.params.id;
    const res = await fetch(`/api/webhook/${eventId}`, { method: "DELETE" });
    if (!res.ok) return new Response("Failed to delete event", { status: 500 });
    return new Response("Event deleted successfully", { status: 200 });
  },
};

export default function EventList(props: PageProps<EventListProps>) {
  const events = useSignal(props.data.initialEvents);

  // Delete event function
  const deleteEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/webhook/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());


      events.value = events.value.filter((event) => event.id !== eventId);
    } catch (error) {
      alert(`Failed to delete event: ${error.message}`);
    }
  };


  const parseAndSanitizeEvent = (payload: string) => {
    try {
      const event = JSON.parse(payload);
      return sanitizeEventData(event);
    } catch (error) {
      console.error("Failed to parse event payload:", error);
      return null;
    }
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events.value.length > 0 ? (
        events.value.map((event) => {
          const eventData = parseAndSanitizeEvent(event.payload);
          if (!eventData) return null;

          const eventStyle = getEventStyle(event.eventType);

          return (
            <div key={event.id} class={`relative border-l-4 p-4 rounded-md shadow-sm ${eventStyle}`}>
              <EventCard eventType={event.eventType} eventData={eventData} />
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