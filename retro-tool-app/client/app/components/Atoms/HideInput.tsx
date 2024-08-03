import { Skeleton, Space } from 'antd'

export const HideInput = () => {

  return (
    <Space>
      <Skeleton.Input size="small" />
      <Skeleton.Button size="small" />
      <Skeleton.Input size="small" />
    </Space>
  )
}

export default HideInput