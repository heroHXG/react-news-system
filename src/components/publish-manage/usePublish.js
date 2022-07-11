import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {notification} from 'antd'

export default function usePublish(type) {
    const [dataSource, setdataSource] = useState([])

    const {username} = JSON.parse(localStorage.getItem('news-token'))
    useEffect(() => {
      axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
        setdataSource(res.data)
      })
    }, [username, type])
    
    const handlePublish = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
       
        axios.patch(`/news/${id}`, {
            publishState: 2,
            publishTime: Date.now()
          }).then(res => {
          
            notification.info({
              message: `通知`,
              description:
                `发布成功，您可以到【发布管理/发布列表】中查看您的新闻发布状态`,
              placement: 'top'
            });
          })
    }
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
       
        axios.patch(`/news/${id}`, {
            publishState: 3,
          }).then(res => {
            notification.info({
              message: `通知`,
              description:
                `下线成功，您可以到【发布管理/已下线】中查看您的新闻发布状态`,
              placement: 'top'
            });
          })
    }
    const handleDelete = (id) => {
        setdataSource(dataSource.filter(data => data.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
              message: `通知`,
              description:
                `删除成功，现在数据库中也没有这条数据了哦`,
              placement: 'top'
            });
        })
    }
  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete
  }
}
