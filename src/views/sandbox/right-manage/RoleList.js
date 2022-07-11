import React, {useState, useEffect} from 'react'
import axios from 'axios'

import{DeleteOutlined, EditOutlined, ExclamationCircleOutlined} from  '@ant-design/icons';
import {Table, Button, Modal, Tree} from 'antd'
const { confirm } = Modal;

export default function RoleList() {
  const [dataSource, setdataSource] = useState([])
  const [rightList, setrightList] = useState([])
  const [currentRights, setcurrentRights] = useState([])
  const [currentId, setcurrentId] = useState(0)
  const [modalVisible, setmodalVisible] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:8000/roles').then((res) => {
      setdataSource(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then((res) => {
      setrightList(res.data)
    })
  }, [])
  
  const columns = [ {
    title: 'ID',
    dataIndex: 'id',
    key: 'name',
    render: (id) => {
      return <b>{id}</b>
    }
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
  },
  {
    title: '操作',
    render: (item) => {
      return (
        <div>
            <Button danger shape="circle"  icon={<DeleteOutlined />} onClick={() =>confirmDelete(item)}/>
            <Button type="primary" shape="circle"  icon={<EditOutlined />}  onClick={() => showModal(item)}/>


            <Modal title="权限分配" visible={modalVisible} onOk={handleOk} onCancel={handleCancel}>
             
              <Tree
                checkable
                checkedKeys={currentRights}

                onCheck={onCheck}
                treeData={rightList}
                checkStrictly={true}
              />
             
            </Modal>
        </div>
      )
    }
  }]
  const onCheck = (selectedKeys) => {
    setcurrentRights(selectedKeys.checked)
  }
  const showModal = (item) => {
    setmodalVisible(true);
    setcurrentRights(item.rights)
    setcurrentId(item.id)
    console.log(item)

  };
  const handleOk = () => {
    setmodalVisible(false);
    setdataSource(dataSource.map(item => {
      if(item.id == currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    axios.patch(`http://localhost:8000/roles/${currentId}`, {
      rights: currentRights
    })
  };

  const handleCancel = () => {
    setmodalVisible(false);
  };
  const confirmDelete = (item) => {
    console.log(item)
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
    setdataSource(dataSource.filter(list => list.id!==item.id))
      axios.delete(`http://localhost:8000/roles/${item.id}`)
  }

  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}></Table>
    </div>
  )
}
