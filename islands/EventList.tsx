import { useSignal } from "@preact/signals";
import EventCard from "../components/EventCard.tsx";
import { sanitizeEventData } from "../utils/sanitizeData.ts";
import { Button } from "../components/Button.tsx";

type EventType = "push" | "pull_request" | "issues" | "issue_comment" | "repository_advisory" | "repository_import" | "fork" | "star" | "default";

type Event = {
  id: string;
  eventType: EventType;
  payload: string;
};

type EventListProps = {
  initialEvents: Event[];
};

// Styles for event types
const eventTypeStyles: Record<EventType, string> = {
  push: "bg-green-50 border-green-300 text-green-900",
  pull_request: "bg-blue-50 border-blue-300 text-blue-900",
  issues: "bg-yellow-50 border-yellow-300 text-yellow-900",
  issue_comment: "bg-indigo-50 border-indigo-300 text-indigo-900",
  repository_advisory: "bg-orange-50 border-orange-300 text-orange-900",
  repository_import: "bg-teal-50 border-teal-300 text-teal-900",
  fork: "bg-purple-50 border-purple-300 text-purple-900",
  star: "bg-red-50 border-red-300 text-red-900",
  default: "bg-gray-50 border-gray-300 text-gray-900",
};

const getEventStyle = (eventType: EventType) =>
  eventTypeStyles[eventType] || eventTypeStyles.default;

export default function EventList({ initialEvents }: EventListProps) {
  const events = useSignal(initialEvents);
  const filter = useSignal<EventType | "all">("all");
  const sortKey = useSignal<string>("eventType");
  const currentPage = useSignal<number>(1);
  const itemsPerPage = 6;

  // Delete event function
  const deleteEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/webhook/${eventId}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      events.value = events.value.filter((event) => event.id !== eventId);
    } catch (error) {
      if (error instanceof Error) {
        alert(`Failed to delete event: ${error.message}`);
      } else {
        alert('Failed to delete event: Unknown error');
      }
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

  // Filter events
  const filteredEvents = filter.value === "all"
    ? events.value
    : events.value.filter((event) => event.eventType === filter.value);

  // Sort events
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortKey.value === "eventType") {
      return a.eventType.localeCompare(b.eventType);
    }
    return 0; // Default fallback
  });

  // Pagination
  const paginatedEvents = sortedEvents.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  );

  const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);

  return (
    <div>
      <div class="mb-4">
        <select
          value={filter.value}
          onChange={(e) => filter.value = e.currentTarget.value as EventType}
          class="p-2 border rounded-md"
        >
          <option value="all">All</option>
          <option value="push">Push</option>
          <option value="pull_request">Pull Request</option>
          <option value="issues">Issues</option>
          <option value="issue_comment">Issue Comment</option>
          <option value="repository_advisory">Repository Advisory</option>
          <option value="repository_import">Repository Import</option>
          <option value="fork">Fork</option>
          <option value="star">Star</option>
        </select>

        <select
          value={sortKey.value}
          onChange={(e) => sortKey.value = e.currentTarget.value}
          class="ml-4 p-2 border rounded-md"
        >
          <option value="eventType">Sort by Event Type</option>
          <option value="date">Sort by Date</option>
          <option value="id">Sort by ID</option>
          <option value="payloadSize">Sort by Payload Size</option>
        </select>
      </div>

      {/* Events List */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedEvents.length > 0 ? (
          paginatedEvents.map((event) => {
            const eventData = parseAndSanitizeEvent(event.payload);
            if (!eventData) return null;

            const eventStyle = getEventStyle(event.eventType);

            return (
              <div key={event.id} class={`relative border-l-4 p-4 rounded-md shadow-sm ${eventStyle}`}>
                <EventCard eventType={event.eventType} eventData={eventData} />
                <Button
                  onClick={() => deleteEvent(event.id)}
                  aria-label="Delete Event"
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

      {/* Pagination Controls */}
      <div class="flex justify-center mt-4">
        <Button
          onClick={() => currentPage.value > 1 && (currentPage.value -= 1)}
          disabled={currentPage.value === 1}
        >
          ←
        </Button>
        <span class="px-4">{`${currentPage.value} / ${totalPages}`}</span>
        <Button
          onClick={() => currentPage.value < totalPages && (currentPage.value += 1)}
          disabled={currentPage.value === totalPages}
        >
          →
        </Button>
      </div>
    </div>
  );
}
