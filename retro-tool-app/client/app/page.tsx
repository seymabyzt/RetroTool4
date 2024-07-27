"use client"
import { useState } from "react";
import Login from "./components/Login";
import { io } from "socket.io-client";

const page = () => {
  
  const [username, setUsername] = useState<string>("")
  const [roomID, setRoomID] = useState<string>("")
  const socket = io("http://localhost:5000")

  return (
    <div>
      <Login username={username} setUsername={setUsername} roomID={roomID} setRoomID={setRoomID} socket={socket} />
    </div>
  )
}

export default page