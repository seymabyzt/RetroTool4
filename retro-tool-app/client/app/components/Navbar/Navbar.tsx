import { Flex, Typography } from 'antd'
import ExportPdf from '../Atoms/ExportPdf'
import Image from 'next/image'
import logo from '@/app/public/logo.png'
const Navbar = ({ step, setStep, isAdmin }: { step: number, setStep: any, isAdmin: boolean }) => {

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
       <Image alt='logo' src={logo} width={80} height={50}></Image>
        <ExportPdf step={step} setStep={setStep} isAdmin={isAdmin} />
      </Flex>
    </Flex>
  )
}

export default Navbar