"use client"
import { useState, useEffect } from "react"

interface ChatProps {
    username: string,
    roomID: string,
    socket: any,
    column: string
}

interface Message {
    username: string,
    message: string,
    roomID: string,
    column: string,
    date: string
}

const Chat = ({ column, username, roomID, socket }: ChatProps) => {

    const [message1, setMessage1] = useState("")
    const [message2, setMessage2] = useState("")
    const [message3, setMessage3] = useState("")
    const [messageList1, setMessageList1] = useState<Message[]>([])
    const [messageList2, setMessageList2] = useState<Message[]>([])
    const [messageList3, setMessageList3] = useState<Message[]>([])

    useEffect(() => {
        const handleNewMessage = (data: Message) => {
            if (data.column === 'one') {
                setMessageList1((prev) => [...prev, data])
            } else if (data.column === 'two') {
                setMessageList2((prev) => [...prev, data])
            } else if (data.column === 'three') {
                setMessageList3((prev) => [...prev, data])
            }
        }
        socket.on("messageReturn", handleNewMessage)

        return () => socket.off("messageReturn", handleNewMessage)
    }, [socket])

    const sendMessage = async () => {
        const currentMessage = column === 'one' ? message1 : column === 'two' ? message2 : message3

        const messageContent: Message = {
            username: username,
            message: currentMessage,
            roomID: roomID,
            column: column,
            date: new Date().toLocaleTimeString()
        }

        await socket.emit("messageContent", messageContent)

        if (column === 'one') {
            setMessageList1((prev) => [...prev, messageContent])
            setMessage1("")
        } else if (column === 'two') {
            setMessageList2((prev) => [...prev, messageContent])
            setMessage2("")
        } else if (column === 'three') {
            setMessageList3((prev) => [...prev, messageContent])
            setMessage3("")
        }
    }

    return (
        <>
            <div>
                {column === 'one' && messageList1.map((msg, index) => (
                    <div key={index}>
                        <div className="mb-4">{msg.message}</div>
                        <div className="message-info position-absolute">{msg.username} - {msg.date}</div>
                    </div>
                ))}
                {column === 'two' && messageList2.map((msg, index) => (
                    <div key={index}>
                        <div className="mb-4">{msg.message}</div>
                        <div className="message-info position-absolute">{msg.username} - {msg.date}</div>
                    </div>
                ))}
                {column === 'three' && messageList3.map((msg, index) => (
                    <div key={index}>
                        <div className="mb-4">{msg.message}</div>
                        <div className="message-info position-absolute">{msg.username} - {msg.date}</div>
                    </div>
                ))}
            </div>
            <div>
                <input
                    value={column === 'one' ? message1 : column === 'two' ? message2 : message3}
                    onChange={(e) => {
                        if (column === 'one') {
                            setMessage1(e.target.value);
                        } else if (column === 'two') {
                            setMessage2(e.target.value);
                        } else {
                            setMessage3(e.target.value);
                        }
                    }}
                    placeholder="Write a message"
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </>
    )
}

export default Chat