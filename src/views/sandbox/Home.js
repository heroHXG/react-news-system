import React, {useEffect, useState} from 'react'
import axios from 'axios'

import { Card, Col, Row, List, Avatar } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
const { Meta } = Card;

export default function Home() {
  useEffect(() => {
    axios.get('/news?publishState=2&_sort=view&_order=desc&_limit=6').then(res => {
      setViewList(res.data)
    })
  }, [])
  const [viewList, setViewList] = useState([])
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
          <List
            size="large"
            dataSource={viewList}
            renderItem={(item) => <List.Item>{item.title}</List.Item>}
          />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多" bordered={true}>
          <List
            size="large"
            dataSource={['111', '222', '333']}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title="Card title"
              description="This is the description"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
};
