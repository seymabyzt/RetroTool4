'use client'

import { useState } from "react"
import Login from "../components/Login"
import { io, Socket } from "socket.io-client"
import  styles  from './retrotool.module.css'
import Topic from "../components/Topic"
const socket: Socket = io("http://localhost:8000")

const page = () => {

  const [username, setUsername] = useState<string>("")
  const [roomID, setRoomID] = useState<string>("")
  const [isLogin, setIsLogin] = useState<boolean>(false)
  return (
    <>
   {roomID && isLogin ? (
    <div className={styles.columnContainer}>
        <Topic column='one' username={username} roomID={roomID} socket={socket} />
        <Topic column='two' username={username} roomID={roomID} socket={socket} />
        <Topic column='three' username={username} roomID={roomID} socket={socket} /> </div>
      ) : (
        <Login username={username} setUsername={setUsername} roomID={roomID} setRoomID={setRoomID} socket={socket} setIsLogin={setIsLogin} />
      )}
    </>
  )
}

export default page