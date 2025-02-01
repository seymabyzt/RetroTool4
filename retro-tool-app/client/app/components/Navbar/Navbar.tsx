import { Avatar, Button, Flex, Tooltip, Typography, Badge } from 'antd'
import ExportPdf from '../Atoms/ExportPdf'
import Image from 'next/image'
import logo from '@/app/public/logo.png'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
const Navbar = ({ step, setStep, isAdmin, roomID, userCount, userList }: { step: number, setStep: any, isAdmin: boolean, roomID: any, userCount: number, userList: any }) => {

  const colorList = ['#FF9F1C', '#2EC4B6', '#E71D36', '#FF5F5F', '#571089', '#F15BB5', '#00BBF9', '#00F5D4', '#FFA07A', '#FA8072'];

  const getColorForUser = (userID: string) => {
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
  const rightSide: React.CSSProperties = {
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10
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

  const btnStyle: React.CSSProperties = {
    color: '#fff',
    fontWeight: "bold",
    backgroundColor: '#eb2f96',
    cursor: "pointer"
  }
  return (
    <Flex>
      <Flex style={boxStyle}>
        <Image alt='logo' src={logo} width={95} height={50}></Image>
        <Flex style={rightSide}>
          <div style={{padding: "5px", borderRadius: "5px", color: "#eb2f96"}}>Room: {roomID}</div>
          <div>
            <Avatar.Group shape="square">
              {userList.map((user: any, index: number) => (
                <Tooltip key={index} title="user">
                  {index === 0 ? (
                    <Badge count={userCount} offset={[-30, 0]}>
                      <Avatar
                        alt="user"
                        style={{ backgroundColor: getColorForUser(user.userID) }}
                        icon={<UserOutlined />}
                      />
                    </Badge>
                  ) : (
                    <Avatar
                      alt="user"
                      style={{ backgroundColor: getColorForUser(user.userID) }}
                      icon={<UserOutlined />}
                    />
                  )}
                </Tooltip>
              ))}
            </Avatar.Group>
          </div>
          <Tooltip title="Log Out">
            <Button style={btnStyle} onClick={() => window.location.href = '/'}>
              <LogoutOutlined />
            </Button>
          </Tooltip>
          <ExportPdf step={step} setStep={setStep} isAdmin={isAdmin} />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Navbar