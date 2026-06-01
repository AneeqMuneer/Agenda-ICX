import express from "express";
import cors from "cors";

const app = express();

// Allowing the frontend to access the backend
app.use(cors({
    // Origin is the frontend url (localhost initially and then the url of the production url)
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

// Allowing all methods for all routes
app.options(/.*/, cors());

// Allowing the frontend to send data in json format
app.use(express.json());

export default app;