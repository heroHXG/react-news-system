import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm'

import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from  '@ant-design/icons';
import { Button, Table, Tag, Modal, Switch, Select } from 'antd'
const { confirm } = Modal;

/*
这里区域管理员和超级管理员都能看到用户列表，都能对用户信息进行修改。
需要设置区域管理员页面只能显示他同个区域的“区域编辑人员”和“自己一个区域管理员”，且区域管理员添加用户只能选择
自己同个区域的，角色只能选择“区域编辑”。
*/ 
export default function UserList() {
  const [userList, setuserList] = useState([])
  const [isAddVisible, setIsAddVisible] = useState(false)
  const [roleList, setroleList] = useState([])
  const [regionList, setregionList] = useState([])
  const addForm = useRef(null)
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  const updateForm = useRef(null)
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
  const [updateCurrent, setupdateCurrent] = useState(null)

  const {id: userId, roleId, region: userRegion, role: {rights}} = JSON.parse(localStorage.getItem('news-token'))
 
  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": 'admin',
      '3': 'editor'
    }
    axios.get('/users?_expand=role').then(res => {
      const list = res.data
      setuserList(roleObj[roleId]==='superadmin' ? list : [
        ...list.filter(item => item.id === userId ),
        ...list.filter(item => item.region === userRegion && roleObj[item.roleId] === 'editor')
      ])
    })
  }, [ roleId, userId, userRegion])

  useEffect(() => {
    axios.get('http://localhost:8000/regions').then(res => {
      const list = res.data
      setregionList(list)
    })
  }, [])

  useEffect(() => {
    axios.get('http://localhost:8000/roles').then(res => {
      const list = res.data
      setroleList(list)
    })
  }, [])

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: 'all'
        }
      ],
      onFilter: (value, item) => {
        if(value === 'all') {
          return item.region === ''
        }
        return item.region === value
      },
    
      render: (region) => {
        return <b>{region? region : '全球'}</b>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',
      render: (key) => {
        return <Tag color="purple">{key}</Tag>
      }
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState}  disabled={item.default} onChange={() => handleSwitch(item)}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button danger shape="circle"  icon={<DeleteOutlined />} disabled={item.default} 
              onClick={() =>confirmDelete(item)}
            />
            <Button type="primary" shape="circle"  icon={<EditOutlined />}  disabled={item.default}
               onClick={() => {handleEdit(item)}}
            />
          </div>
        )
      }
    },
  ]
  const handleEdit = (item) => {
      setIsUpdateVisible(true)
      setTimeout(() => {
        if(item.roleId==1) {
          setisUpdateDisabled(true)
        }else{
          setisUpdateDisabled(false)
        }
        updateForm.current.setFieldsValue(item)
      }, 0);

      setupdateCurrent(item)
  }
  const handleSwitch = (item) => {
    item.roleState = !item.roleState
    setuserList([...userList]) 
    axios.patch(`http://localhost:8000/users/${item.id}`, {
      roleState:  item.roleState
    })
  }
 
  const confirmDelete = (item) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hope you can know what are you doing, 前端删除的同时会从数据库中同步删除数据。',
      onOk() {
        deleteMethod(item)
      },
  
      onCancel() {
      },
    });
  }
  const deleteMethod = (item) => {
    // 删除之后，当前页面同步状态 + 后端同步
    setuserList(userList.filter(list => list.id !== item.id))
    axios.delete(`http://localhost:8000/users/${item.id}`)
   
  }
  const addFormOk = () => {
      // addForm.current.validateFields() 返回值是一个promise对象
      addForm.current.validateFields().then(res => {
          setIsAddVisible(false)
          // 添加完成时候把所有输入框的值清空
          addForm.current.resetFields()

          axios.post('http://localhost:8000/users', {
            ...res,
            "roleState": true,
            "default": false
          }).then(res=> {
            setuserList([ {
              ...res.data,
              role: roleList.filter(item => item.roleType == res.data.roleId)[0]
            }, ...userList])
          })
      }).catch((error) => {
        console.log(error)
      })
  }
  const updateFormOk = () => {
    updateForm.current.validateFields().then(validateRes => {
      
        axios.patch(`http://localhost:8000/users/${updateCurrent.id}`, {
          ...validateRes,
          "roleState": true,
          "default": false
        }).then(res=> {

          let index = userList.map(list => list.id).indexOf(res.data.id)
          let newItem = {...res.data, role: roleList.filter(item => item.roleType == res.data.roleId)[0]}
          let newArr = userList.concat([])
          newArr.splice(index, 1,newItem )
          setuserList(newArr)
        })

        setIsUpdateVisible(false)
        // 更新确认以后强行让UserForm 组件重新渲染一遍
        setisUpdateDisabled(!isUpdateDisabled)

    }).catch((error) => {
      console.log(error)
    })
  }
  return (
   
    <div>
      <Button type="primary" onClick={() => {
          setIsAddVisible(true)
      }}>添加用户</Button>

      <Table dataSource={userList} columns={columns} 
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />;


      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定添加"
        cancelText="取消"
        onCancel={() => {
          setIsAddVisible(false)
        }}
        onOk={() => {
            addFormOk()
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={addForm}/>
      </Modal>

      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="确定更新"
        cancelText="取消"
        onCancel={(item) => {
          setIsUpdateVisible(false)
          setisUpdateDisabled(!isUpdateDisabled)
        }}
        onOk={() => {
            updateFormOk()
        }}
      >
        <UserForm regionList={regionList} roleList={roleList} ref={updateForm}
         isUpdateDisabled={isUpdateDisabled} isUpdate={true}/>
      </Modal>
    </div>
  )
 
}
