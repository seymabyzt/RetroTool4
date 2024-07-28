"use client"
import { useState, useEffect } from "react"

interface ChatProps {
    username: string,
    roomID: string,
    socket: any
}

interface Message {
    username: string,
    message: string,
    roomID: string,
    date: string
}

const Chat = ({ username, roomID, socket }: ChatProps) => {

    const [message, setMessage] = useState("")
    const [messageList, setMessageList] = useState<Message[]>([])

    useEffect(() => {
        const handleNewMessage = (data: any) => {
            setMessageList((prev) => [...prev, data])
        }
        socket.on("messageReturn", handleNewMessage)

        return () => socket.off("messageReturn", handleNewMessage)
    }, [socket])

    const getCurrentTime = () => {
        const date = new Date()
        return date.getHours() + ":" + date.getMinutes()
    }

    const sendMessage = async () => {
        const messageContent = {
            username: username,
            message: message,
            roomID: roomID,
            date: getCurrentTime()
        }
        await socket.emit("messageContent", messageContent)
        setMessageList((prev) => [...prev, messageContent])
        setMessage("")
    }

    return (
        <>
            <div>
                {messageList && messageList.map((msg: any, index) => {
                    return (
                        <div key={index}>
                            <div className="mb-4">{msg.message}</div>
                            <div className="message-info position-absolute">{msg.username} - {msg.date}</div>
                        </div>
                    )
                })}
            </div>
            <div>
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message"></input>
                <button onClick={sendMessage}>Send</button>
            </div>
        </>
    )
}

export default Chat