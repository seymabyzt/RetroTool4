import { Flex, Typography } from 'antd'
import ExportPdf from '../Atoms/ExportPdf'

const Navbar = ({ step, setStep }: { step: number, setStep: any }) => {

  const { Title } = Typography

  const boxStyle: React.CSSProperties = {
    width: '100%',
    height: 60,
    borderBottom: '1px solid #9BB0C1',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    margin: 15,
    background: '#f0f5ff'
  }

  return (
    <Flex gap="middle" >
      <Flex style={boxStyle}>
        <Title level={4}>RetroTool4</Title>
        <ExportPdf step={step} setStep={setStep} />
      </Flex>
    </Flex>
  )
}

export default Navbar