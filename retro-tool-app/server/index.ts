import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "https://retro-tool4.vercel.app",
        methods: ["GET", "POST"],
    },
})

const rooms: Record<string, string[]> = {}

io.on("connection", (socket) => {
    socket.on("roomID", (data) => {
        const { roomID } = data

        socket.join(roomID)

        if (!rooms[roomID]) {
            rooms[roomID] = []
        }

        if (!rooms[roomID].includes(socket.id)) {
            rooms[roomID].push(socket.id)
        }

        if (rooms[roomID].length === 1) {
            io.to(socket.id).emit("adminAssigned", true);
        } else {
            io.to(socket.id).emit("adminAssigned", false);
        }
    })

    socket.on("commentContent", (data) => {
        socket.to(data.roomID).emit("commentReturn", data)
    })

    socket.on('deleteComment', ({ commentID, roomID }) => {
        io.to(roomID).emit('commentDeleted', commentID)
    })

    socket.on("stepChange", ({ roomID, newStep }) => {
        io.to(roomID).emit("stepUpdated", newStep)
    })

    socket.on("likeCount", ({ commentID, roomID, column, userID }) => {
        io.to(roomID).emit("likeCountUpdated", { commentID, column, userID })
    })

    socket.on("updateCommentContent", ({ roomID, column, updatedComments }) => {
        io.to(roomID).emit("commentListUpdated", { column, updatedComments })
    })

    socket.on("disconnecting", () => {
        for (const roomID of socket.rooms) {
            const index = rooms[roomID]?.indexOf(socket.id)
            if (index !== -1 && rooms[roomID]) {
                rooms[roomID].splice(index, 1)

                if (index === 0 && rooms[roomID].length > 0) {
                    const newAdminID = rooms[roomID][0];
                    io.to(newAdminID).emit("adminAssigned", { isAdmin: true })
                }
            }
        }
    })
})

const port = 8000

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})