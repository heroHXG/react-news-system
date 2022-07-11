

import NewsPublish from '@components/publish-manage/NewsPublish'
import usePublish from '@components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Sunset() {
  // publishState:3  已经下线的
  
  const {dataSource, handleDelete} = usePublish(3)
  return (
    <div>
      <NewsPublish dataSource={dataSource}  button={
        (id) => <Button danger onClick={() => handleDelete(id)}>删除</Button>
      }/>
    </div>
  )
}
