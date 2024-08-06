import { Flex, Typography } from 'antd'
import StepButton from '../Atoms/StepButton'

const Navbar = ({ step, setStep }: { step: number, setStep: any }) => {

  const { Title } = Typography

  const boxStyle: React.CSSProperties = {
    width: '100%',
    height: 60,
    borderBottom: '1px solid #40a9ff',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    background: '#f0f5ff'
  }

  return (
    <Flex gap="middle" align="start" vertical>
      <Flex style={boxStyle}>
        <Title level={4}>RetroTool4</Title>
        <StepButton step={step} setStep={setStep} />
      </Flex>
    </Flex>
  )
}

export default Navbar