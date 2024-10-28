// components/EventCard.tsx

import { Commit } from "../type.ts";

interface EventCardProps {
    eventType: string;
    eventData: any;
}

export default function EventCard({ eventType, eventData }: EventCardProps) {
    return (
        <div class="bg-white shadow-md rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-800">
                    {eventType} Event
                </h2>
                <span class="text-sm text-gray-500">
                    {new Date(eventData?.head_commit?.timestamp)
                        .toLocaleString()}
                </span>
            </div>
            <p class="text-gray-600 mb-4">
                <strong>Repository:</strong> {eventData?.repository?.full_name}
            </p>
            <p class="text-gray-600 mb-4">
                <strong>Pushed by:</strong> {eventData?.pusher?.name}
            </p>
            <div>
                <h3 class="text-lg font-medium text-gray-800 mb-2">Commits:</h3>
                <div class="space-y-4">
                    {eventData?.commits?.map((commit: Commit) => (
                        <div
                            class="border border-gray-200 rounded p-4"
                            key={commit.id}
                        >
                            <p class="text-gray-800 font-medium">
                                {commit.message}
                            </p>
                            <p class="text-gray-600 text-sm">
                                <strong>Author:</strong> {commit.author.name}
                            </p>
                            <a
                                href={commit.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-sm"
                            >
                                View Commit
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
