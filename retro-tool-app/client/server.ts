import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import express from "express";

// Use environment variables
const port = process.env.PORT || 8000; 
const clientUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000";

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (clientUrl.indexOf(origin) === -1) {
            const msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NEXT_PUBLIC_CLIENT_URL, // This will use the URL from .env.production
        methods: ["GET", "POST"],
        credentials: true
    }
});

const rooms: Record<string, string[]> = {};

// Socket.io connection setup
io.on("connection", (socket) => {
    // Your existing socket.io event handlers...
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
