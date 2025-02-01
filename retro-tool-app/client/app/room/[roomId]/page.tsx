'use client'
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Topic from "../../components/Topic";
import Navbar from "../../components/Navbar/Navbar";
import { v4 as uuidv4 } from 'uuid';
import { Row, Col } from 'antd';
import { Toaster, toast } from "react-hot-toast";
import styles from '@/app/room/retrotool.module.css';
import { darknavy } from "@/app/ThemesColor/ThemesColor";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import StepDescription from "@/app/components/Atoms/StepDescription";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
let socket: Socket;

const Room = ({ params }: any) => {
  const roomID = params.roomId;
  const [userID, setUserID] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminMessageShown, setAdminMessageShown] = useState<boolean>(false);
  const [userCount, setUserCount] = useState(1);
  const [userList, setUserList] =  useState<any[]>([]);

  const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://retrotool4server.onrender.com"
    : "http://localhost:8000";

  useEffect(() => {
    let storedUserID = localStorage.getItem("userID");
    if (!storedUserID) {
      storedUserID = uuidv4();
      localStorage.setItem("userID", storedUserID);
    }
    setUserID(storedUserID);

   if (!socket) {
    socket = io(SERVER_URL);
}

    socket.emit("joinRoom", { roomID, userID: storedUserID });

    socket.on("adminAssigned", (adminStatus: boolean) => {
      setIsAdmin(adminStatus);
      if (adminStatus) {
        toast.success("You are the admin of this room!");
      }
    });

    socket.on("userList", (users) => {
      setUserList([...users]); 
    });

    socket.on("stepUpdated", (newStep: number) => {
      setStep(newStep);
    });

    socket.on("userCount", (count: number) => {
      setUserCount(count);
    });
    const handleBeforeUnload = (event: any) => {
      event.preventDefault();
      socket.emit("leaveRoom", { roomID, userID: storedUserID });  
  };
    
  if (roomID) {
    fetchStep();
  }
  window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      socket.off("adminAssigned");
      socket.off("stepUpdated");
      socket?.off("userCount");
      socket?.off("userList");
      socket.disconnect();
      socket.emit("leaveRoom", { roomID, userID: storedUserID });  

      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomID]);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    socket.emit("stepChange", { roomID, newStep });
    var docRef = doc(db, roomID, "step");
    setDoc(docRef,
      { step: newStep }
    );
  };
  const fetchStep = async () => {
    try {
      const docRef = doc(db, roomID, "step");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data && data.step !== undefined) {
          setStep(data.step); 
        }
      }
    } catch (error) {
      console.error("Failed to fetch step from Firestore:", error);
    }
  };
  const [step, setStep] = useState(1);

  const colStyle = {
    padding: '0 7px',
  }

  return (
    <>
    <DndProvider backend={HTML5Backend}>
      <div className={styles.roomPage} style={{ backgroundColor: darknavy }}>
        <Toaster />
        <Navbar userList={userList} userCount={userCount} roomID={roomID} step={step} setStep={handleStepChange} isAdmin={isAdmin}
        />
        <StepDescription step={step} />
        {roomID &&
          <Row style={{ padding: "5px 15px", borderRadius: '10px' }}>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='one' userID={userID} roomID={roomID} socket={socket} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='two' userID={userID} roomID={roomID} socket={socket} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='three' userID={userID} roomID={roomID} socket={socket} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='four' userID={userID} roomID={roomID} socket={socket} />
            </Col>
          </Row>
        }
      </div>
    </DndProvider>
    </>
  );
};

export default Room;

