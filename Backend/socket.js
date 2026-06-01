import { Server } from "socket.io";
import { detectIntent } from "./Websocket/dialogflowSocket.js";
import { emitStreamingReply } from "./Websocket/streamReply.js";

export const initializeSocket = (server) => {
    // Checking if env variables are set
    if (!process.env.FRONTEND_URL) {
        throw new Error("FRONTEND_URL is not set in environment variables");
    }

    const io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
        },
    });

    // Socket.io server level error handling
    io.engine.on("connection_error", (error) => {
        console.error("Socket.IO server error:", error.message);
    });

    io.on("connection", (socket) => {
        console.log(`Client connected: ${socket.id}`);
    
        socket.on("message", async (data) => {
            // input validation
            const userMessage = data?.message || data;
            if (!userMessage || typeof userMessage !== "string" || userMessage.trim() === "") {
                socket.emit("error", { message: "Message cannot be empty." });
                return;
            }
    
            console.log("User query received.");
        
            try {
                const botReply = await detectIntent(socket.id, userMessage.trim());
    
                if (!botReply) {
                    socket.emit("error", { message: "No response received from bot." });
                    return;
                }
        
                await emitStreamingReply(socket, botReply);
                console.log("Streamed response to client");
        
            } catch (error) {
                console.error("ERROR:", error);
                socket.emit("error", { message: "Something went wrong. Please try again." });
            }
        });
    
        socket.on("connect_error", (error) => {
            console.error(`Connection error for ${socket.id}:`, error.message);
        });
    
        socket.on("disconnect", (reason) => {
            console.log(`Client disconnected: ${socket.id} | Reason: ${reason}`);
        });
    });
};