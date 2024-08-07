'use client'

import { useState, useEffect } from "react"
import { io, Socket } from "socket.io-client"
import Topic from "../../components/Topic"
import Navbar from "../../components/Navbar/Navbar"
import { v4 as uuidv4 } from 'uuid'
import { Row, Col } from 'antd'
import { Toaster } from "react-hot-toast"

const socket: Socket = io("http://localhost:8000")

const page = ({ params }: any) => {

  const roomID = params.roomId

  const [userID, setUserID] = useState<string>("")

  useEffect(() => {
    setUserID(uuidv4())
    socket.emit("roomID", roomID)

    socket.on("stepUpdated", (newStep) => {
      setStep(newStep)
    })

    return () => {
      socket.off("stepUpdated")
    }
  }, [roomID])

  const handleStepChange = (newStep: number) => {
    setStep(newStep)
    socket.emit("stepChange", { roomID, newStep })
  }

  const [step, setStep] = useState(1)

  return (
    <>
      <Toaster />
      <Navbar step={step} setStep={handleStepChange} />
      {roomID &&
        <Row>
          <Col xs={12} md={6} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '20px', border: "1px solid black" }}>
            <Topic step={step} column='one' userID={userID} roomID={roomID} socket={socket} />
          </Col>
          <Col xs={12} md={6} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '20px', border: "1px solid black" }}>
            <Topic step={step} column='two' userID={userID} roomID={roomID} socket={socket} />
          </Col>
          <Col xs={12} md={6} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '20px', border: "1px solid black" }}>
            <Topic step={step} column='three' userID={userID} roomID={roomID} socket={socket} />
          </Col>
          <Col xs={12} md={6} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '20px', border: "1px solid black" }}>
            <Topic step={step} column='four' userID={userID} roomID={roomID} socket={socket} />
          </Col>
        </Row>
      }
    </>
  )
}
export default page