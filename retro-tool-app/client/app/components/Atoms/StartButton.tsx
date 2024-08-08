import { Button } from 'antd';
import { pink } from '@/app/ThemesColor/ThemesColor';

const StartButton = ({ children }: any) => {
const ButtonStyle = {
  backgroundColor: pink,

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