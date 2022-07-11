import NewsPublish from '@components/publish-manage/NewsPublish'
import usePublish from '@components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Unpublished() {
  // publishState:1 表示待发布的
  
  const {dataSource, handlePublish} = usePublish(1)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={
        (id) => <Button type="primary" onClick={() => handlePublish(id)}>发布</Button>
      }/>
    </div>
  )
}