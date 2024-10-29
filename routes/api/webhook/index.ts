import { Handlers } from "$fresh/server.ts";
import { getAllEvents, insertEvent } from "../../../Deno_Kv/kv.ts";

type EventType = "push" | "pull_request" | "issues" | "issue_comment" | "repository_advisory" | "repository_import" | "fork" | "star" | "default";
interface Event {
    id: string;
    eventType: EventType;
    payload: string;
}
export const handler: Handlers = {
    async GET(_req, _ctx) {
        const events = await getAllEvents();
        return new Response(JSON.stringify(events), {
            headers: { "Content-Type": "application/json" },
        });
    },

    async POST(req, _ctx) {
        const headers = req.headers;
        const deliveryId = headers.get("X-GitHub-Delivery");
        const eventType = headers.get("X-GitHub-Event") || "unknown_event";
        const payload = await req.text();

        if (!deliveryId) {
            return new Response("Missing X-GitHub-Delivery header", {
                status: 400,
            });
        }

        const event = { id: deliveryId, eventType, payload };
        const success = await insertEvent(event as Event);

        if (!success) {
            return new Response("Failed to save event", { status: 500 });
        }
        return new Response(JSON.stringify({ id: deliveryId }), {
            status: 201,
        });
    },
};
