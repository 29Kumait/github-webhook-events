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
    eventType: string;
    payload: string;
}
