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
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'next/navigation'

const Room = () => {
  const params = useParams();
  const roomID = params.roomId;
 const [userID, setUserID] = useState<string>("");

  const socket: Socket = io("http://localhost:8000",{
    query: {
      roomID
    },
});

  const [userCount, setUserCount] = useState<any[]>([]);
  const [newRoomID, setnewRoomID] = useState();
  const [columnsName, setColumsName] = useState();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [step, setStep] = useState(1);
  const [participants, setParticipants] = useState<any[]>([]);


  const fetchRoomData = async () => {
    try {
      const docRef = doc(db, roomID, "roomData");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const roomData = docSnap.data();
        setnewRoomID(roomData.roomID);
        setColumsName(roomData.columns);
        console.log("Oda verisi:", roomData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Firestore'dan veri alınırken hata oluştu:", error);
    }
  };
 

  useEffect(() => {
    fetchRoomData();
    if (!roomID) return;

    const storedAdminStatus = localStorage.getItem(roomID + "isadmin");

    socket.on("adminAssigned", (data) => {
      console.log('admin socket.id', socket.id)
      if(data === true && storedAdminStatus === "true") {
        setIsAdmin(true);
        toast.success("You are the admin of this room!");
      }
    })
    console.log(socket)
    console.log(userID)

       socket.on("userCount", (data) => {
        if (data) {
          setUserCount(data);
        }
      });
      console.log(userCount)
      
      socket.on("userID", (userID) => {
        if (userID && roomID) {
          setUserID(userID);
          // const usersRef = doc(db, roomID, 'users')
          // setDoc(usersRef, userID)
          toast.success("You are joined of this room!");
        }
      });
      // if(participants !== null || participants !== undefined) {
      //   const admin = participants.find((participant) => participant === 'admin');
      //   console.log(admin)

      //   if (admin && storedAdminStatus === "true") {
      //     setIsAdmin(true);
      //     console.log('admin olması lazım')
      //     toast.success("You are the admin of this room!");
      //     console.log('neden admin değil')
      //   }
      //   else {
      //     console.log("admin değilse")
      //   }
      // }
  
    // console.log(participants)
    // socket.on("adminRemoved", (data) => {
    //   if (data.adminRemoved) {
    //     setIsAdmin(false);
    //     localStorage.removeItem(roomID + "isadmin");
    //   }
    // });

    // socket.on("newAdminAssigned", (data) => {
    //   if (data.newAdmin) {
    //     setIsAdmin(true);
    //     localStorage.setItem(roomID + "isadmin", "true");
    //   }
    // });
    // socket.on("adminLeft", (data) => {
    //   if (data === true) {
    //     if (!storedAdminStatus) {
    //       setIsAdmin(true);
    //       toast.success("You connected again as admin of this room!");
    //       socket.emit("adminConnectedAgain", { roomID });
    //     }

    //   }
    // })

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

    // const handleBeforeUnload = (event: any) => {
    //   if (isAdmin) {
    //     event.preventDefault();
    //     event.returnValue = "You are the admin. Leaving will assign admin to someone else.";
    //     localStorage.removeItem(roomID + "isadmin");
    //   }
    // };
    // window.addEventListener("beforeunload", handleBeforeUnload);

    // Temizleme işlemi
    return () => {
      // window.removeEventListener("beforeunload", handleBeforeUnload);
      // socket.off("updateParticipants")
      // socket.off("adminAssigned");
      socket.off("stepUpdated");
      // socket.off("adminRemoved");
      // socket.off("newAdminAssigned");
      // socket.off("userJoinedRoom");
      // socket.off("adminLeft");
      //socket.off("usersInRoom")
      socket.off("userCount");
      socket.disconnect();
    };
  }, [roomID])

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
    socket.emit("stepChange", { roomID, newStep });
    var docRef = doc(db, roomID, "step");
    setDoc(docRef, { step: newStep });
  };

  const colStyle = {
    padding: '0 7px',
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.roomPage} style={{ backgroundColor: darknavy }}>
        <Toaster />
        <Navbar newRoomID={newRoomID} step={step} setStep={handleStepChange} isAdmin={isAdmin} userCount={userCount} />
        <StepDescription step={step} />
        {roomID &&
          <Row style={{ padding: "5px 15px", borderRadius: '10px' }}>
       
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} userID={userID} column='one' roomID={roomID} socket={socket} columnsName={columnsName} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} userID={userID} column='two' roomID={roomID} socket={socket} columnsName={columnsName} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} userID={userID} column='three' roomID={roomID} socket={socket} columnsName={columnsName} />
            </Col>
            <Col xs={24} md={12} lg={6} style={colStyle}>
              <Topic isAdmin={isAdmin} step={step} userID={userID} column='four' roomID={roomID} socket={socket} columnsName={columnsName} />
            </Col>

          </Row>
        }
      </div>
    </DndProvider>
  );
};

export default Room;
