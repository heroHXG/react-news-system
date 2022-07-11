import React from 'react'
import usePublish from '@components/publish-manage/usePublish'
import NewsPublish from '@components/publish-manage/NewsPublish'
import { Button } from 'antd'

export default function Unpublished() {
  // publishState:2 表示已经发布的
  const {dataSource, handleSunset} = usePublish(2)
  
  return (
    <div>
      <NewsPublish dataSource={dataSource}  button={
        (id) => <Button danger onClick={() => handleSunset(id)}>下线</Button>
      }/>
    </div>
  )
}
