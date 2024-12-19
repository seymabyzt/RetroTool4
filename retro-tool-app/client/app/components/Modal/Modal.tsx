'use client'
import { Button } from "antd";
import React, { useState } from "react";
import { pink } from '@/app/ThemesColor/ThemesColor';
import { CloseCircleOutlined } from "@ant-design/icons";
import { db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
   
    const [roomNameInput, setRoomName] = useState<string>("")
    const [firstColumn1, setfirstColumn1] = useState<string>("")
    const [secondColumn2, setsecondColumn2] = useState<string>("")
    const [thirdColumn3, setthirdColumn3] = useState<string>("")
    let roomName: string = roomNameInput.replace(/\s+/g, '').toLowerCase()
    if (!isOpen) return null;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const roomNameInput = capitalizeWords(e.target.value)
        setRoomName(roomNameInput);

    };
    const handleChangeFirstColumn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const firstColumn1Input = capitalizeWords(e.target.value)
        setfirstColumn1(firstColumn1Input)
    };
    const handleChangeSecondColumn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const secondColumn2Input = capitalizeWords(e.target.value);
        setsecondColumn2(secondColumn2Input)
    };
    const handleChangeThirdColumn = (e: React.ChangeEvent<HTMLInputElement>) => {
        const thirdColumn3Input = capitalizeWords(e.target.value);
        setthirdColumn3(thirdColumn3Input)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const roomRef = doc(db, roomName, 'roomData'); 
            const roomData = {
                createdAt: new Date(),
                roomID: roomNameInput,
                columns: { 
                    firstColumn: firstColumn1, 
                    secondColumn: secondColumn2, 
                    thirdColumn: thirdColumn3
                }
            };
            await setDoc(roomRef, roomData);
            localStorage.setItem(roomName, JSON.stringify(roomData));
            localStorage.setItem((roomName + "isadmin"), 'true');

        } catch (error) {
            console.error("Oda oluşturulurken hata oluştu:", error);
        }
        window.location.href = `/room/${roomName}`;
    };

    return (
        <div style={overlayStyles}>
            <div style={modalStyles}>
                <div style={formTitle}>
                    <h2>Create a Room</h2>
                    <CloseCircleOutlined onClick={onClose} style={{ fontSize: '20px' }} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={inputStyles}>
                        <label htmlFor="roomNameInput">Room Name:</label>
                        <input
                            style={inputContentStyles}
                            placeholder="Retrospective"
                            type="text"
                            value={roomNameInput}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={inputStyles}>
                        <label htmlFor="column1">First column:</label>
                        <input
                            style={inputContentStyles}
                            placeholder="It worked well that..."
                            type="text"
                            value={firstColumn1}
                            onChange={handleChangeFirstColumn}
                        />
                    </div>
                    <div style={inputStyles}>
                        <label htmlFor="column2">Second column:</label>
                        <input
                            style={inputContentStyles}
                            placeholder="We could improve..."
                            type="text"
                            value={secondColumn2}
                            onChange={handleChangeSecondColumn}
                        />
                    </div>
                    <div style={inputStyles}>
                        <label htmlFor="column3">Third column:</label>
                        <input
                            style={inputContentStyles}
                            placeholder="I want to ask about..."
                            type="text"
                            value={thirdColumn3}
                            onChange={handleChangeThirdColumn}
                        />
                    </div>
                    <Button size='large'
                        shape="round"
                        style={createRoomStyle}
                        htmlType="submit">Create</Button>
                </form>

            </div>
        </div>
    );
};

// Modal stilleri
const createRoomStyle: React.CSSProperties = {
    backgroundColor: pink,
    color: "white",
    margin: "5px 0",
    fontSize: "1.1em"
}
const overlayStyles: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}
const formTitle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between"
}
const inputContentStyles: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    margin: "8px 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
}
const inputStyles: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    fontSize: "1.1em",
    padding: "10px 0",
}
const modalStyles: React.CSSProperties = {
    backgroundColor: "rgb(58, 57, 97)",
    color: "white",
    border: "1px solid white",
    padding: "20px",
    borderRadius: "8px",
    width: "300px",
};
function capitalizeWords(sentence: string) {
    return sentence
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default Modal;


