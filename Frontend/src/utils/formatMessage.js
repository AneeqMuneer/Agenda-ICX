const ISO_DATE =
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/g;

/** Turn raw ISO timestamps in bot text into readable local dates */
export const formatMessageText = (text) => {
    if (!text) return text;

    return text.replace(ISO_DATE, (iso) => {
        const date = new Date(iso);
        if (Number.isNaN(date.getTime())) return iso;

        return date.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    });
};
