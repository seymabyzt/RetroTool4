'use client'

import { useState } from "react"
import Login from "../../components/Login"
import { io, Socket } from "socket.io-client"
import  styles  from '../retrotool.module.css'
import Topic from "../../components/Topic";
import Navbar from "../../components/Navbar/Navbar"
const socket: Socket = io("http://localhost:8000")

const page = ({params} : any) => {
  console.log(params.roomId)
  const [username, setUsername] = useState<string>("")
  const roomID = params.roomId
  const [isLogin, setIsLogin] = useState<boolean>(false)
  return (
    <>
    <Navbar></Navbar>
   {roomID && isLogin ? (

    <div className={styles.columnContainer}>
        <Topic column='one' username={username} roomID={roomID} socket={socket} />
        <Topic column='two' username={username} roomID={roomID} socket={socket} />
        <Topic column='three' username={username} roomID={roomID} socket={socket} /> </div>
      ) : (
        <Login username={username} setUsername={setUsername} roomID={roomID} socket={socket} setIsLogin={setIsLogin} />
      )}
    </>
  )
}

export default page