import { Button } from 'antd';
import { pink } from '@/app/ThemesColor/ThemesColor';

const StartButton = ({ children }: any) => {
  const ButtonStyle = {
    backgroundColor: pink,
    color: "white",
    margin: "5px 0"
  }
  return (
    <>
      <Button style={ButtonStyle} size='large' shape="round" >
        {children}
      </Button>
    </>

  )
}

export default StartButton