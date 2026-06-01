import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

const createMessage = (partial) => ({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: new Date().toISOString(),
    ...partial,
});

export const useSocket = () => {
    const socketRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 10,
            reconnectionDelay: 1000,
            timeout: 10000,
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            setIsConnected(true);
            setConnectionError(null);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setIsTyping(false);
            setIsStreaming(false);
        });

        socket.on("connect_error", (err) => {
            setIsConnected(false);
            setIsTyping(false);
            setIsStreaming(false);
            setConnectionError(
                err.message || "Could not reach the server. Is the backend running on port 4000?"
            );
        });

        socket.on("bot_stream_start", ({ messageId, timestamp }) => {
            setIsTyping(false);
            setIsStreaming(true);
            setMessages((prev) => [
                ...prev,
                {
                    id: messageId,
                    text: "",
                    sender: "bot",
                    timestamp: timestamp || new Date().toISOString(),
                    isStreaming: true,
                },
            ]);
        });

        socket.on("bot_stream_chunk", ({ messageId, chunk }) => {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === messageId ? { ...m, text: m.text + chunk } : m
                )
            );
        });

        socket.on("bot_stream_end", ({ messageId, timestamp }) => {
            setIsStreaming(false);
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === messageId
                        ? {
                              ...m,
                              isStreaming: false,
                              timestamp: timestamp || m.timestamp,
                          }
                        : m
                )
            );
        });

        // Fallback if backend sends a single payload (non-streaming)
        socket.on("bot_response", (data) => {
            setIsTyping(false);
            setIsStreaming(false);
            setMessages((prev) => [
                ...prev,
                createMessage({
                    text: data.message,
                    sender: "bot",
                    timestamp: data.timestamp || new Date().toISOString(),
                }),
            ]);
        });

        socket.on("error", (data) => {
            setIsTyping(false);
            setIsStreaming(false);
            setMessages((prev) => [
                ...prev,
                createMessage({
                    text: data?.message || "Something went wrong.",
                    sender: "bot",
                    isError: true,
                }),
            ]);
        });

        return () => {
            socket.off();
            socket.disconnect();
        };
    }, []);

    const sendMessage = useCallback((text) => {
        const trimmed = text?.trim();
        if (!trimmed || !socketRef.current?.connected || isStreaming) return;

        setMessages((prev) => [
            ...prev,
            createMessage({ text: trimmed, sender: "user" }),
        ]);
        setIsTyping(true);
        setConnectionError(null);

        socketRef.current.emit("message", { message: trimmed });
    }, [isStreaming]);

    return {
        messages,
        isConnected,
        isTyping,
        isStreaming,
        connectionError,
        sendMessage,
    };
};
