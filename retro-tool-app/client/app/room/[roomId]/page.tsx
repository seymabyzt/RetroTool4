'use client'

import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
//import styles from '../retrotool.module.css'
import Topic from "../../components/Topic"
import Navbar from "../../components/Navbar/Navbar"
import { v4 as uuidv4 } from 'uuid'
import { Col, Row } from 'antd';

const socket: Socket = io("http://localhost:8000")



const page = ({ params }: any) => {

  const roomID = params.roomId

  const [userID, setUserID] = useState<string>("")

  useEffect(() => {
    setUserID(uuidv4());
    socket.emit("roomID", roomID);

    socket.on("stepUpdated", (newStep) => {
      setStep(newStep);
    });

    return () => {
      socket.off("stepUpdated");
    };
  }, [roomID]);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    socket.emit("stepChange", { roomID, newStep });
  };

  const [step, setStep] = useState(1)

  return (
    <>
      <Navbar step={step} setStep={handleStepChange} />
      {roomID &&
        <Row style={{ justifyContent: "space-between" }}>
          <Col md={{ span: 5 }} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '10px' }}>
            <Topic step={step} column='one' userID={userID} roomID={roomID} socket={socket} />
          </Col>
          <Col md={{ span: 5 }} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '10px' }}>
            <Topic step={step} column='two' userID={userID} roomID={roomID} socket={socket} />
          </Col>
          <Col md={{ span: 5 }} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '10px' }}>
            <Topic step={step} column='three' userID={userID} roomID={roomID} socket={socket} />
          </Col>
          <Col md={{ span: 5 }} style={{ backgroundColor: '#f0f5ff', height: '90vh', padding: '10px' }}>
            <Topic step={step} column='four' userID={userID} roomID={roomID} socket={socket} />
          </Col>
        </Row>
      }
    </>
  )
}
export default page