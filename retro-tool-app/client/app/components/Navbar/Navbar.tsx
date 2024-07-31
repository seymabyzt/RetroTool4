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

const Navbar: React.FC = () => {
  return (
    <Flex gap="middle" align="start" vertical>
   
      <Flex style={boxStyle}>
      <Title level={4}>RetroTool4</Title>
      <Button style={btnStyle}>Show Comment</Button>
      </Flex>
    </Flex>
  );
};

export default Navbar;