'use client'

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import styles from '../retrotool.module.css'
import Topic from "../../components/Topic"
import Navbar from "../../components/Navbar/Navbar"
import { v4 as uuidv4 } from 'uuid'

const socket: Socket = io("http://localhost:8000")

const page = ({ params }: any) => {

  const roomID = params.roomId

  const [userID, setUserID] = useState<string>("")

  useEffect(() => {
    setUserID(uuidv4())
    socket.emit("roomID", roomID)
  }, [])

  return (
    <>
      <Navbar />
      {roomID &&
        <div className={styles.columnContainer}>
          <Topic column='one' userID={userID} roomID={roomID} socket={socket} />
          <Topic column='two' userID={userID} roomID={roomID} socket={socket} />
          <Topic column='three' userID={userID} roomID={roomID} socket={socket} />
        </div>
      }
    </>
  )
}
export default page