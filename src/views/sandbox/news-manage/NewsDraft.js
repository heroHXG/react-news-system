import React, {useEffect, useState} from 'react'
import axios from 'axios'

import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, CloudUploadOutlined} from  '@ant-design/icons';
import { Button, Table, Tag, Modal, notification } from 'antd'
const { confirm } = Modal;

export default function NewsDraft(props) {
  const [dataSource, setdataSource] = useState([])
  const {username} = JSON.parse(localStorage.getItem('news-token'))
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      setdataSource(list)
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
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      render: (key) => {
        return <Tag color="purple">{key}</Tag>
      }
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (key) => {
        return <Tag color="pink">{key.title}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle"  icon={<DeleteOutlined />} onClick={() =>confirmDelete(item)}/>
            <Button type="primary" shape="circle"  icon={<EditOutlined />} onClick={() => {
                props.history.push(`/news-manage/update/${item.id}`)
            }}/>
            <Button type="primary" shape="circle"  icon={<CloudUploadOutlined /> } onClick={() => {
                handleCheck(item.id)
            }}/>
          </div>
        )
      }
    },
  ]
  
 
  const confirmDelete = (item) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除草稿箱内容吗？会从服务器端同步删除哦！',
  
      onOk() {
        console.log('OK');
        deleteMethod(item)
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item) => {
      console.log(item)
      // 删除之后，当前页面同步状态 + 后端同步
      setdataSource(dataSource.filter(list => list.id!==item.id))
      axios.delete(`/news/${item.id}`)
  }
  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      "auditState": 1,  //传0表示草稿箱，传1表示提交审核
    }).then(res=>{
        props.history.push('/audit-manage/list')
        notification.info({
            message: `通知`,
            description:
              `您可以到审核列表中查看您添加的内容`,
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
        rowKey = {item => item.id}
      />
      
    </div>
  )
}
