"use client"
import { useState, useEffect } from "react"


interface ChatProps {
    username: string,
    roomID: string,
    socket: any
}

interface Message {
    username: string;
    message: string;
    roomID: string;
    date: string;
}

const page = ({ username, roomID, socket }: ChatProps) => {

    console.log("roomID", roomID)

    const [message, setMessage] = useState("")
    const [messageList, setMessageList] = useState<Message[]>([])

    useEffect(() => {
        socket?.on("messageReturn", (data: any) => {
            setMessageList((prev) => [...prev, data])
        })
    }, [socket])

    const getCurrentTime = () => {
        const date = new Date()
        return date.getHours() + ":" + date.getMinutes()
    }

    const sendMessage = () => {
        const messageContent = {
            username: username,
            message: message,
            roomID: roomID,
            date: getCurrentTime()
        }
        socket?.emit("messageContent", messageContent)
        setMessageList((prev) => [...prev, messageContent])
        setMessage("")
    }

    console.log(messageList, "mesajlar")

    return (
        <div>
            <div>
                {messageList && messageList.map((msg: any, index) => {
                    return (
                        <div key={index}>
                            <div>
                                <div className="mb-4">{msg.message}</div>
                                <div className="message-info position-absolute">{msg.username} - {msg.date}</div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div>
                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message"></input>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}

export default page