'use client'
import { Button } from 'antd';
import { pink } from '@/app/ThemesColor/ThemesColor';
import { useState } from 'react';
import Modal from '../Modal/Modal';

const StartButton = () => {
  const ButtonStyle = {
    backgroundColor: pink,
    color: "white",
    margin: "5px 0"
  }
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button onClick={openModal} style={ButtonStyle} size='large' shape="round" > Get Start
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </>

  )
}

export default StartButton