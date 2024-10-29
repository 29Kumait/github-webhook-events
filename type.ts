// types.ts

export interface Commit {
    id: string;
    message: string;
    timestamp: string;
    url: string;
    author: {
        name: string;
        username: string;
    };
}

export interface Event {
    id: string;
    eventType: EventType;
    payload: string;
}

export type EventType = "push" | "pull_request" | "issues" | "issue_comment" | "repository_advisory" | "repository_import" | "fork" | "star" | "default";