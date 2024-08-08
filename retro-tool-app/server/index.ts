import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
});

const rooms: any = {}; // Odalara göre kullanıcıları saklamak için bir obje

io.on("connection", (socket) => {
    socket.on("roomID", ({ roomID, userID }) => {
        socket.join(roomID);

        if (!rooms[roomID]) {
            rooms[roomID] = []; // Eğer oda yoksa yeni bir dizi oluştur
        }

        // Kullanıcıyı odaya ekle
        rooms[roomID].push({ socketID: socket.id, userID });

        // İlk kullanıcıyı admin olarak atama
        if (rooms[roomID].length === 1) {
            io.to(socket.id).emit("adminAssigned", true); // İlk kullanıcıya admin ataması
            console.log(`${userID} is assigned as admin in room ${roomID}`);
        } else {
            io.to(socket.id).emit("adminAssigned", false);
        }

        console.log(`Room ${roomID} has ${rooms[roomID].length} users.`);
    });

    socket.on("commentContent", (data) => {
        socket.to(data.roomID).emit("commentReturn", data);
    });

    socket.on('deleteComment', ({ commentID, roomID }) => {
        io.to(roomID).emit('commentDeleted', commentID);
    });

    socket.on("stepChange", ({ roomID, newStep }) => {
        io.to(roomID).emit("stepUpdated", newStep);
    });

    socket.on("likeCount", ({ commentID, roomID, column, userID }) => {
        io.to(roomID).emit("likeCountUpdated", { commentID, column, userID });
    });

   
});

const port = 8000;

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
