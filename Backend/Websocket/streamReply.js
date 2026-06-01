const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tokenize = (text) => text.match(/[^\s]+\s*|\s+/g) ?? [text];

export const emitStreamingReply = async (socket, text) => {
    const messageId = `${Date.now()}-${socket.id.slice(0, 8)}`;
    const timestamp = new Date().toISOString();

    socket.emit("bot_stream_start", { messageId, timestamp });

    for (const chunk of tokenize(text)) {
        if (!socket.connected) return;

        socket.emit("bot_stream_chunk", { messageId, chunk });
        await sleep(Math.min(48, 12 + chunk.length * 4));
    }

    if (socket.connected) {
        socket.emit("bot_stream_end", { messageId, timestamp });
    }
};
