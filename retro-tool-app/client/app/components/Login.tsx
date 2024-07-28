interface LoginProps {
    username: string,
    setUsername: any,
    roomID: string,
    setRoomID: any,
    socket: any,
    setIsLogin: any
}

const Login = ({ username, setUsername, roomID, setRoomID, socket, setIsLogin }: LoginProps) => {

    const openRoom = () => {
        setIsLogin(true)
        socket.emit("roomID", roomID)
    }

    return (
        <>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input value={roomID} onChange={(e) => setRoomID(e.target.value)} placeholder="Room ID" />
            <button onClick={openRoom}>Chat</button>
        </>
    )
}

export default Login