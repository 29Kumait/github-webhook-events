import { Commit } from "../type.ts";

type EventType = "push" | "pull_request" | "issues" | "issue_comment" | "repository_advisory" | "repository_import" | "fork" | "star" | "default";

interface EventCardProps {
    eventType: EventType;
    eventData: {
        head_commit?: {
            timestamp?: string;
        };
        repository?: {
            full_name?: string;
        };
        pusher?: {
            name?: string;
        };
        commits?: Commit[];
    };
}

export default function EventCard({ eventType, eventData }: EventCardProps) {
    // Display different messages depending on the eventType
    const getEventDescription = (eventType: EventType) => {
        switch (eventType) {
            case "push":
                return "Push Event";
            case "pull_request":
                return "Pull Request Event";
            case "issues":
                return "Issues Event";
            case "issue_comment":
                return "Issue Comment Event";
            case "repository_advisory":
                return "Repository Advisory Event";
            case "repository_import":
                return "Repository Import Event";
            case "fork":
                return "Fork Event";
            case "star":
                return "Star Event";
            default:
                return "Default Event";
        }
    };

    return (
        <div class="bg-white shadow-md rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
                <h2 class="text-xl font-semibold text-gray-800">
                    {getEventDescription(eventType)}
                </h2>
                <span class="text-sm text-gray-500">
                    {eventData?.head_commit?.timestamp ? new Date(eventData.head_commit.timestamp).toLocaleString() : "No timestamp available"}
                </span>
            </div>
            <p class="text-gray-600 mb-4">
                <strong>Repository:</strong> {eventData?.repository?.full_name || "N/A"}
            </p>
            <p class="text-gray-600 mb-4">
                <strong>Pushed by:</strong> {eventData?.pusher?.name || "Unknown"}
            </p>
            {eventData?.commits && eventData.commits.length > 0 && (
                <div>
                    <h3 class="text-lg font-medium text-gray-800 mb-2">Commits:</h3>
                    <div class="space-y-4">
                        {eventData.commits.map((commit: Commit) => (
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
            )}
        </div>
    );
}
