import { Avatar, Flex, Tooltip, Typography } from 'antd'
import ExportPdf from '../Atoms/ExportPdf'
import Image from 'next/image'
import logo from '@/app/public/logo.png'
import { UserOutlined } from '@ant-design/icons'
const Navbar = ({ step, setStep, isAdmin, roomID, userCount, userList }: { step: number, setStep: any, isAdmin: boolean, roomID: any, userCount: number, userList: any }) => {

  const colorList = ['#FF9F1C', '#2EC4B6', '#E71D36', '#FF5F5F', '#571089', '#F15BB5', '#00BBF9', '#00F5D4', '#FFA07A', '#FA8072'];
  const getColorForUser = (userID: string) => {
    // Örnek basit hashing ile index hesaplanabilir
    const index = Math.abs(
      userID.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    ) % colorList.length;
    return colorList[index];
  };
  const boxStyle: React.CSSProperties = {
    width: '100%',
    height: 60,
    borderBottom: '1px solid #9BB0C1',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: "10px 23px 5px 23px",
    background: '#f0f5ff'
  }
  const userCountStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 600,
    color: '#ff3131',
    background: '#fff',
    borderRadius: '50%',
    padding: '3px'
  }
  const userStyle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 600,
    marginRight: 5
  }

  return (
    <Flex gap="middle" >
      <Flex style={boxStyle}>
       <Image alt='logo' src={logo} width={95} height={50}></Image>
       <div>Room Name: {roomID}</div>
        <Avatar.Group shape="square">
          {userList.map((user:any, index:any) => (
            <Tooltip key={index}>
              <Avatar
                style={{ backgroundColor: getColorForUser(user.userID) }}
                icon={<UserOutlined />}
              />
            </Tooltip>
          ))}
   </Avatar.Group>
        <ExportPdf step={step} setStep={setStep} isAdmin={isAdmin} />
      </Flex>
    </Flex>
  )
}

export default Navbar