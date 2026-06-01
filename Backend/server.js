import app from "./app.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { initializeSocket } from "./socket.js";

// Error handling for errors that are outside try catch blocks
process.on("uncaughtException" , (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Exiting the process due to an uncaught exception");
    process.exit(1);
});

// Loading the environment variables
dotenv.config({path: "./config/config.env"});

// Manually creating the server
const server = createServer(app);

// Attaching Socket.io to our server to handle websocket connections
initializeSocket(server);

// Starting the server
server.listen(process.env.BACKEND_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.BACKEND_PORT}/`);
});

// Error handling for errors that are due to unhandled promise rejection
process.on("unhandledRejection" , (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to an unhandled rejection");
    server.close(() => {
        process.exit(1);
    });
});