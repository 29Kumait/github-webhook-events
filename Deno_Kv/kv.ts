/// <reference lib="deno.unstable" />

const URL = Deno.env.get("URL");

const kv = await Deno.openKv(URL);

export async function insertEvent(
    event: { id: string; eventType: string; payload: string },
): Promise<boolean> {
    const key = ["events", event.id];
    const result = await kv.atomic().set(key, event).commit();
    return result.ok;
}

export async function getAllEvents(): Promise<Event[]> {
    const events = [];
    for await (const entry of kv.list<Event>({ prefix: ["events"] })) {
        const id = entry.key[1] as string;
        events.push({ id, ...entry.value });
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
