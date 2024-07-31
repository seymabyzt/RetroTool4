interface LoginProps {
    username: string,
    setUsername: any,
    roomID: string,
    socket: any,
    setIsLogin: any
}

const Login = ({ username, setUsername, roomID, socket, setIsLogin }: LoginProps) => {

    const openRoom = () => {
        setIsLogin(true)
        socket.emit("roomID", roomID)
    }

    return (
        <>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <button onClick={openRoom}>Chat</button>
        </>
    )
}

export default Login