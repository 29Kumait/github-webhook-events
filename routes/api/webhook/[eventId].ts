/// <reference lib="deno.unstable" />

import { Handlers } from "$fresh/server.ts";

import { deleteEventById } from "../../../Deno_Kv/kv.ts";

export const handler: Handlers = {
    async DELETE(_req, ctx) {
        const eventId = ctx.params.eventId;

        if (!eventId) {
            return new Response("Invalid event ID", { status: 400 });
        }

        const deleted = await deleteEventById(eventId);

        if (!deleted) {
            return new Response(`No event with ID ${eventId} found`, {
                status: 404,
            });
        }

        return new Response(`Event ${eventId} deleted`, { status: 200 });
    },
};
