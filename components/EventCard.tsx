import { Commit } from "../type.ts";

type EventType =
    | "push"
    | "pull_request"
    | "issues"
    | "issue_comment"
    | "repository_advisory"
    | "repository_import"
    | "fork"
    | "star"
    | "default";

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
        pull_request?: {
            title?: string;
            url?: string;
            user?: {
                login?: string;
            };
        };
        issue?: {
            title?: string;
            url?: string;
            user?: {
                login?: string;
            };
        };
        comment?: {
            body?: string;
            user?: {
                login?: string;
            };
            html_url?: string;
        };
        forkedRepository?: {
            full_name?: string;
            owner?: {
                login?: string;
            };
        };
        sender?: {
            login?: string;
        };
        created_at?: string;
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

    const renderEventDetails = (eventType: EventType) => {
        switch (eventType) {
            case "push":
                return (
                    <>
                        <p className="text-gray-600 mb-4">
                            <strong>Pushed by:</strong> {eventData?.pusher?.name || "Unknown"}
                        </p>
                        {eventData?.commits && eventData.commits.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">
                                    Commits:
                                </h3>
                                <div className="space-y-4">
                                    {eventData.commits.map((commit: Commit) => (
                                        <div
                                            className="border border-gray-200 rounded p-4"
                                            key={commit.id}
                                        >
                                            <p className="text-gray-800 font-medium">
                                                {commit.message}
                                            </p>
                                            <p className="text-gray-600 text-sm">
                                                <strong>Author:</strong> {commit.author.name}
                                            </p>
                                            <a
                                                href={commit.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:underline text-sm"
                                            >
                                                View Commit
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                );
            case "pull_request":
                return (
                    <>
                        <p className="text-gray-600 mb-4">
                            <strong>Pull Request Title:</strong> {eventData?.pull_request?.title || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>Opened by:</strong> {eventData?.pull_request?.user?.login || "Unknown"}
                        </p>
                        <a
                            href={eventData?.pull_request?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                        >
                            View Pull Request
                        </a>
                    </>
                );
            case "issues":
                return (
                    <>
                        <p className="text-gray-600 mb-4">
                            <strong>Issue Title:</strong> {eventData?.issue?.title || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>Opened by:</strong> {eventData?.issue?.user?.login || "Unknown"}
                        </p>
                        <a
                            href={eventData?.issue?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                        >
                            View Issue
                        </a>
                    </>
                );
            case "issue_comment":
                return (
                    <>
                        <p className="text-gray-600 mb-4">
                            <strong>Comment by:</strong> {eventData?.comment?.user?.login || "Unknown"}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>Comment:</strong> {eventData?.comment?.body || "N/A"}
                        </p>
                        <a
                            href={eventData?.comment?.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                        >
                            View Comment
                        </a>
                    </>
                );
            case "fork":
                return (
                    <>
                        <p className="text-gray-600 mb-4">
                            <strong>Forked Repository:</strong> {eventData?.forkedRepository?.full_name || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>Forked by:</strong> {eventData?.forkedRepository?.owner?.login || "Unknown"}
                        </p>
                    </>
                );
            case "star":
                return (
                    <>
                        <p className="text-gray-600 mb-4">
                            <strong>Starred Repository:</strong> {eventData?.repository?.full_name || "N/A"}
                        </p>
                        <p className="text-gray-600 mb-4">
                            <strong>Starred by:</strong> {eventData?.sender?.login || "Unknown"}
                        </p>
                    </>
                );
            default:
                return <p className="text-gray-600">No additional details available for this event.</p>;
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                    {getEventDescription(eventType)}
                </h2>
                <span className="text-sm text-gray-500">
                    {eventData?.head_commit?.timestamp || eventData?.pull_request?.title || eventData?.issue?.title || eventData?.comment?.html_url ? new Date(eventData.head_commit?.timestamp || eventData.pull_request?.created_at || eventData.issue?.created_at || eventData.comment?.created_at).toLocaleString() : "No timestamp available"}
                </span>
            </div>
            <p className="text-gray-600 mb-4">
                <strong>Repository:</strong> {eventData?.repository?.full_name || "N/A"}
            </p>
            {renderEventDetails(eventType)}
        </div>
    );
}
