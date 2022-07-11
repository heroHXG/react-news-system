import React,  {useEffect, useState} from 'react'
import {NavLink} from 'react-router-dom'

import axios from 'axios'

import { Button, Table, Tag, notification } from 'antd'

export default function Audit() {
 
  const [dataSource, setdataSource] = useState([])

  const {id: userId, roleId, region: userRegion, username} = JSON.parse(localStorage.getItem('news-token'))
 
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": 'admin',
      '3': 'editor'
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      // 为了以防editor审核新闻权限被错误放开，这里对editor审核新闻做一些兜底---审核自己的都不能做到
      if(roleObj[roleId] === 'editor') {
        return setdataSource([])
      }
      setdataSource(roleObj[roleId]==='superadmin' ? list : [
        ...list.filter(item => item.author === username ),
        ...list.filter(item => item.region === userRegion && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [roleId, userId, userRegion, username])


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
      title: '操作',
      dataIndex: 'auditState',
      render: (auditState, item) => {
        return ( <div>
          <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>通过</Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>驳回</Button>
          </div>
        )
      }
    },
  ]

  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【审核管理/审核列表】中查看您的新闻审核状态`,
        placement: 'top'
      });
    })
  }
 
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} 
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </div>
  )
 
}
