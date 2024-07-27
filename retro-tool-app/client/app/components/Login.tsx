import Link from "next/link"

interface LoginProps {
    username: string,
    setUsername: any,
    roomID: string,
    setRoomID: any,
    socket: any
}

const Login = ({ username, setUsername, roomID, setRoomID, socket }: LoginProps) => {

    console.log(username, "username at Login")
    console.log(roomID, "roomID at Login")
    
    const openRoom = () => {
        socket.emit("roomID", roomID)
        console.log("openRoom fonksiyonu çalıştı")
    }

    return (
        <>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input value={roomID} onChange={(e) => setRoomID(e.target.value)} placeholder="Room ID" />
            <Link href="/chat" onClick={openRoom}>Chat</Link>
        </>
    )
}

export default Login