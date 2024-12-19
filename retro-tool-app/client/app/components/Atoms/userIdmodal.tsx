'use client'
import { useAppSelector } from '@/app/redux/store/store';
import { Button } from 'antd';
import React, { useState, useEffect } from 'react';
import { pink } from '@/app/ThemesColor/ThemesColor';

interface UserIdModalProps {
  roomID: string | string[];
  onClose: () => void; 
}

function UserIdmodal({ roomID, onClose }: UserIdModalProps) {
  const [userName, setUserName] = useState('');
  
  const handleNameSubmit = () => {
    if (userName.trim()) {
      localStorage.setItem((roomID + "user"), userName)
      // firebase' e de ekle 
      onClose(); 
    } else {
      alert('Lütfen bir isim girin.');
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: { key: string; }) => {
      if (event.key === "Enter") {
        handleNameSubmit();
      }
    };

    // Enter tuşuna basıldığında handleNameSubmit'i çağır
    window.addEventListener("keydown", handleKeyDown);

    // Temizleme işlemi
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [userName]);


  return (
    <div>
          <div style={overlay}>
        <div style={modalStyle}>
          <h2>Nickname</h2>
       
          <input
           style={inputContentStyles}
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter a name" 
          />
                  <p>Your nickname will not share any other person</p>

          <Button 
          size='large'
          shape="round"
          style={createRoomStyle}
          onClick={handleNameSubmit}>Join Room </Button>
        </div>
        </div>
    </div>
  );
}

const modalStyle: React.CSSProperties = {
  position: 'fixed',
  zIndex: 999,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '20px',
  background: 'rgb(58, 57, 97)',
  color: 'white',
  borderRadius: '8px',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
};
const inputContentStyles: React.CSSProperties = {
  width: '100%',
  padding: "10px",
  margin: "8px 0",
  borderRadius: "4px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
}

const overlay: React.CSSProperties = {
  position: 'relative',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1
}
const createRoomStyle: React.CSSProperties = {
  backgroundColor: pink,
  color: "white",
  margin: "5px 0",
  float: 'right',
  fontSize: "1.1em"
}
export default UserIdmodal;
