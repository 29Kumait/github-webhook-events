/// <reference lib="deno.unstable" />

const kv = await Deno.openKv(Deno.env.get("URL") ?? undefined);
type EventType = "push" | "pull_request" | "issues" | "issue_comment" | "repository_advisory" | "repository_import" | "fork" | "star" | "default";
interface Event {
    id: string;
    eventType: EventType;
    payload: string;
}

export async function insertEvent(
    event: Event,
): Promise<boolean> {
    const key = ["events", event.id];
    const result = await kv.atomic().set(key, event).commit();
    return result.ok;
}

export async function getAllEvents(): Promise<Event[]> {
    const events: Event[] = [];
    for await (const entry of kv.list<Event>({ prefix: ["events"] })) {
        const id = entry.key[1] as string;
        const event = { id, eventType: entry.value.eventType, payload: entry.value.payload };
        events.push(event);
    }
    return events;
}


export async function deleteEventById(eventId: string): Promise<boolean> {
    const eventKey = ["events", eventId];
    const eventRes = await kv.get(eventKey);

    if (!eventRes.value) {
        console.log(`Event with ID ${eventId} not found in KV store`);
        return false;
    }

    const result = await kv.atomic().check(eventRes).delete(eventKey).commit();

    if (!result.ok) {
        console.log(`Failed to delete event with ID ${eventId}`);
        return false;
    }

    console.log(`Event with ID ${eventId} successfully deleted`);
    return true;
}
