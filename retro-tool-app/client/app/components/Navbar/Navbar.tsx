import React from 'react';
import { Button, Flex, Typography } from 'antd';

const boxStyle: React.CSSProperties = {
  width: '100%',
  height: 60,
  borderBottom: '1px solid #40a9ff',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  background: '#f0f5ff'
};
const btnStyle: React.CSSProperties = {
  color: '#fff',
  background: '#364d79',
};

const { Title } = Typography;

const Navbar = ({ step, setStep }: { step: number, setStep: any }) => {
  return (
    <Flex gap="middle" align="start" vertical>

      <Flex style={boxStyle}>
        <Title level={4}>RetroTool4</Title>
        <Button onClick={() => setStep(step + 1)} style={btnStyle}>Group & Vote Comments</Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;