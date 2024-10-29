// utils/sanitizeData.ts

interface AnyObject {
    [key: string]: any;
}

export function sanitizeEventData(rawData: AnyObject): AnyObject {
    // Deep clone the data to avoid mutating the original
    const data = structuredClone(rawData);

    // Set of fields to remove for faster lookups
    const sensitiveFields = new Set([
        "email",
        "private",
        "node_id",
        "gravatar_id",
        "site_admin",
    ]);

    function removeSensitiveInfo(obj: AnyObject) {
        if (Array.isArray(obj)) {
            obj.forEach(removeSensitiveInfo);
        } else if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                if (sensitiveFields.has(key)) {
                    delete obj[key];
                } else {
                    removeSensitiveInfo(obj[key]);
                }
            }
        }
    }

    removeSensitiveInfo(data);
    return data;
}