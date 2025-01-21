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
import { collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import {
  addDoc,
  deleteDoc,
  deleteField,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  getDocs,
  updateDoc,
  query, where,
  getDoc,
  documentId,
  DocumentData,
  QuerySnapshot,
} from "firebase/firestore";
const socket: Socket = io("https://retrotool4server.onrender.com");

const Room = ({ params }: any) => {
  const roomID = params.roomId;
  const [userID, setUserID] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminMessageShown, setAdminMessageShown] = useState<boolean>(false);

  useEffect(() => {
    let collectionREF = collection(db, roomID);
    console.log(collectionREF)
    var userIdOnStorage =localStorage.getItem("user");
    if (userIdOnStorage ==null || userIdOnStorage == undefined)
    {
    const userId = uuidv4();
    setUserID(userId);
    localStorage.setItem("user",userId);
    socket.emit("roomID", { roomID, userID });

  }
  else{
    const userId = userIdOnStorage
    setUserID(userId);
    socket.emit("roomID", { roomID, userID });

  }


  socket.on("adminAssigned", (adminStatus: boolean) => {
    var isadmin =localStorage.getItem("isadmin");
    if (isadmin == "true")
      {
        adminStatus = true;
      }
    setIsAdmin(adminStatus);
    if (adminStatus && !adminMessageShown) {
      toast.success("You are the admin of this room!");
      setAdminMessageShown(true);
      localStorage.setItem("isadmin","true");
    }
  });

 

    socket.on("stepUpdated", (newStep) => {
      setStep(newStep);
    });


    const stepDocRef = doc(db, roomID, "step");
    getDoc(stepDocRef).then((myDoc) => {
      const selectedStep = myDoc.data();
      if (selectedStep != null && selectedStep != undefined) {
        const objs = {
          roomID: roomID, step: step
        }
        setStep(selectedStep.step);
      }
    }
    );

    return () => {
      socket.off("stepUpdated");
      socket.off("adminAssigned");
    };
  }, [roomID, adminMessageShown]);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    socket.emit("stepChange", { roomID, newStep });
    var docRef = doc(db, roomID, "step");
    setDoc(docRef,
      { step: newStep }
    );
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
        <Navbar step={step} setStep={handleStepChange} isAdmin={isAdmin} />
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
function setDomLoaded(arg0: boolean) {
  throw new Error("Function not implemented.");
}

