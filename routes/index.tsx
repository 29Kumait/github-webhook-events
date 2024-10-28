import { Handlers, PageProps } from "$fresh/server.ts";
import EventList from "../islands/EventList.tsx";
import { Event } from "../type.ts";
import { getAllEvents } from "../Deno_Kv/kv.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const events = await getAllEvents();
    return ctx.render({ events });
  },
};

export default function HomePage(props: PageProps<{ events: Event[] }>) {
  const { events } = props.data;

  return (
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6">GitHub Webhook Events</h1>
      <EventList initialEvents={events} />
    </div>
  );
}
