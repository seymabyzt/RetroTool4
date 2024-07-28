"use client"
import { useState } from "react"
import { io, Socket } from "socket.io-client"

// Components
import Login from "./components/Login"
import Chat from "./components/Chat"

const socket: Socket = io("http://localhost:8000")

const page = () => {

  const [username, setUsername] = useState<string>("")
  const [roomID, setRoomID] = useState<string>("")
  const [isLogin, setIsLogin] = useState<boolean>(false)

  return (
    <>
      {roomID && isLogin ? (
        <Chat username={username} roomID={roomID} socket={socket} />
      ) : (
        <Login username={username} setUsername={setUsername} roomID={roomID} setRoomID={setRoomID} socket={socket} setIsLogin={setIsLogin} />
      )}
    </>
  )
}

export default page