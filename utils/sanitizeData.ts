// utils/sanitizeData.ts

export function sanitizeEventData(rawData: any): any {
    // Deep clone the data to avoid mutating the original
    const data = JSON.parse(JSON.stringify(rawData));

    // List of fields to remove
    const sensitiveFields = [
        "email",
        "private",
        "node_id",
        "gravatar_id",
        "site_admin",
    ];

    function removeSensitiveInfo(obj: any) {
        if (Array.isArray(obj)) {
            obj.forEach(removeSensitiveInfo);
        } else if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                if (sensitiveFields.includes(key)) {
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
