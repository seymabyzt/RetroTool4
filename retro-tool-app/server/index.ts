import express from "express"
import cors from "cors"
import http from "http"
import { Server } from "socket.io"

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
})

io.on("connection", (socket) => {
    socket.on("roomID", (data) => {
        socket.join(data)
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
})

const port = 8000

server.listen(port, () => {
    console.log(`Server is running on port ${port}.`)
})