import React, {useEffect, useState} from 'react'
import axios from 'axios'

import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from  '@ant-design/icons';
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
const { confirm } = Modal;

export default function RightList() {
  const [menuList, setmenuList] = useState([])
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      const list = res.data
      list.forEach(element => {
        if(element.children.length === 0) {
          element.children=""
        }
      });
      setmenuList(list)
    })
   
  }, [])
  
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
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => {
        return <Tag color="purple">{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle"  icon={<DeleteOutlined />} onClick={() =>confirmDelete(item)}/>
            <Popover content={content(item)} title="是否开启权限" trigger={item.pagepermisson === undefined? '':'click'}>
              <Button type="primary" shape="circle"  icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/>
            </Popover>
          </div>
        )
      }
    },
  ]
  const content = (item) => {
      return (
        <div style={{textAlign: 'center'}}>
            <Switch checked={item.pagepermisson} onChange={() => {
                switchMethod(item)
            }}></Switch>
        </div>
      );
  }
  const switchMethod = (item) => {
    item.pagepermisson = item.pagepermisson===1 ? 0 : 1
    setmenuList([...menuList])
    if(item.grade === 1) {
      axios.patch(`http://localhost:8000/rights/${item.id}`, {
        pagepermisson: item.pagepermisson 
      })
    }else {
      axios.patch(`http://localhost:8000/children/${item.id}`, {
        pagepermisson: item.pagepermisson 
      })
    }
  }
  const confirmDelete = (item) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: 'Some descriptions',
  
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
    if(item.grade == 1) {
      setmenuList(menuList.filter(list => list.id!==item.id))
      axios.delete(`http://localhost:8000/rights/${item.id}`)
    }else if(item.grade == 2) {
      let list = menuList.filter(data => data.id == item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      console.log(list, menuList)

      setmenuList([...menuList])

      axios.delete(`http://localhost:8000/children/${item.id}`)

    }
   
  }
  return (
    <div>
      <Table dataSource={menuList} columns={columns} 
        pagination={{
          pageSize: 5
        }}
      />;
    </div>
  )
}
