'use client'
import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import Topic from "../../components/Topic";
import Navbar from "../../components/Navbar/Navbar";
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
  setDoc,
  getDoc,
} from "firebase/firestore";
import { addUserToRoom } from "@/app/userInfo";
import { useRef } from "react";
// import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux/store/store";
import UserIdmodal from "@/app/components/Atoms/userIdmodal";


const Room = () => {
  const socket =  io("http://localhost:8000");
  const roomID = useAppSelector((state) => state.modal.roomID);
  // const roomID = decodeURIComponent(params.roomId)
  const [userID, setUserID] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // const [adminMessageShown, setAdminMessageShown] = useState<boolean>(false);
  const [step, setStep] = useState(1);

  useEffect(()=> {
    socket.on("assignSocketID", (userID) => {
      setUserID(userID);
      localStorage.setItem(roomID + "user", userID);
      // addUserToRoom(roomID, userID, isAdmin);
    });
    if(!roomID) return; 
    socket.emit("roomID", { roomID });
    const storedAdminStatus = localStorage.getItem(roomID + "isadmin");
    if (storedAdminStatus === "true") {
      setIsAdmin(true);
    }
    socket.on("adminAssigned", (adminStatus) => {
      if (adminStatus) {
        setIsAdmin(true);
        toast.success("You are the admin of this room!");
        console.log("buraya girdi")
        localStorage.setItem(roomID + "isadmin", "true");
      }
    });
    socket.on("adminRemoved", (data) => {
      if (data.adminRemoved) {
        setIsAdmin(false);
        localStorage.removeItem(roomID + "isadmin");
      }
    });

    socket.on("newAdminAssigned", (data) => {
      if (data.newAdmin) {
        setIsAdmin(true);
        localStorage.setItem(roomID + "isadmin", "true");
      }
    });

    socket.on("stepUpdated", (newStep) => {
      setStep(newStep);
    });

    // Firebase'den adım bilgisi al
    const stepDocRef = doc(db, roomID, "step");
    getDoc(stepDocRef).then((myDoc) => {
      const selectedStep = myDoc.data();
      if (selectedStep) {
        setStep(selectedStep.step);
      }
    });
    const handleBeforeUnload = (event: any) => {
      if (isAdmin) {
        event.preventDefault();
        event.returnValue = "You are the admin. Leaving will assign admin to someone else.";
        localStorage.removeItem(roomID + "isadmin");
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Temizleme işlemi
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);

      socket.off("roomID")
      socket.off("adminAssigned");
      socket.off("assignSocketID");
      socket.off("stepUpdated");
      socket.off("adminRemoved");
      socket.off("newAdminAssigned");
    };
  }, [])

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    // socket.emit("stepChange", { roomID, newStep });
    var docRef = doc(db, roomID, "step");
    setDoc(docRef, { step: newStep });
  };

  const colStyle = {
    padding: '0 7px',
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.roomPage} style={{ backgroundColor: darknavy }}>
      <UserIdmodal></UserIdmodal>
        <Toaster />
        <Navbar roomID={roomID} step={step} setStep={handleStepChange} isAdmin={isAdmin} />
        <StepDescription step={step} />
        {roomID &&
          <Row style={{ padding: "5px 15px", borderRadius: '10px' }}>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='one' roomID={roomID} socket={socket}/>
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='two'  roomID={roomID} socket={socket} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='three'  roomID={roomID} socket={socket} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} column='four' roomID={roomID} socket={socket} />
            </Col>
          </Row>
        }
      </div>
    </DndProvider>
  );
};

export default Room;
