

import React from 'react'
import {NavLink} from 'react-router-dom'

import { Table, Tag } from 'antd'

export default function NewsPublish(props) {
  
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
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
      render: (item) => {
        return ( <div>
          {props.button(item.id)}
          </div>
        )
      }
    },
  ]

  return (
    <div>
      <Table dataSource={props.dataSource} columns={columns} 
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </div>
  )
}
