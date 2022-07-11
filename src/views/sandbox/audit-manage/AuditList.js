import React, {useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'

import {Table, Tag, Button, notification} from 'antd'

import axios from 'axios'

export default function AuditList(props) {

  const { username} = JSON.parse(localStorage.getItem('news-token'))
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setdataSource(res.data)
    })
  }, [username])
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'name',
      render: (id) => {
        return <b>{id}</b>
      }
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <Tag color="purple">{category.title}</Tag>
      }
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ['', 'orange', 'green', 'red']
        const auditList = ['未审核','审核中', '已通过','未通过']
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      dataIndex: 'auditState',
      render: (auditState, item) => {
        return ( <div>
          {
            item.auditState === 1 && <Button danger onClick={() =>handleRervert(item)}>撤销</Button>
          }
          {
            item.auditState === 2 && <Button type="warning" onClick={() =>handlePublish(item)}>发布</Button>
          }
          {
            item.auditState === 3 && (
              <div>
                  <Button type="primary" onClick={() =>handleUpdate(item)}>更新</Button>
                  <Button danger disabled onClick={() =>handleRervert1(item)}>撤销</Button>
              </div>
            )
          }
          </div>
        )
      }
    },
  ]
  const handleRervert1 = (item) => {
    console.log('这个功能暂时不做')
  }
  const handleRervert = (item) => {
      setdataSource(dataSource.filter(data => data.id !== item.id))
      axios.patch(`/news/${item.id}`, {
        auditState: 0
      }).then(res => {
        notification.info({
          message: `通知`,
          description:
            `您可以到草稿箱中查看您撤回的内容`,
          placement: 'top'
      });
      })
  }
  const handleUpdate = (item) => {
      props.history.push(`/news-manage/update/${item.id}`)
  }
  const handlePublish = (item) => {
      axios.patch(`/news/${item.id}`, {
        publishState: 2,
        publishTime: Date.now()
      }).then(res => {
        props.history.push('/publish-manage/published')
          notification.info({
            message: `通知`,
            description:
              `您可以到【发布管理/已经发布】中查看您的内容`,
            placement: 'top'
          });
      })
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} 
        // Table 组件内部可直接使用pagination
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}
