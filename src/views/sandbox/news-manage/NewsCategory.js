import React,  {useEffect, useState, useRef,useContext} from 'react'
import axios from 'axios'

import { ExclamationCircleOutlined} from  '@ant-design/icons';
import { Button, Table, Tag, Modal, Form, Input } from 'antd'
const { confirm } = Modal;

export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get('/categories').then(res => {
      setdataSource(res.data)
    })
  },[])
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
      title: '栏目名称',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return <Tag color="blue">{title}</Tag>
      },
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },

    {
      title: '操作',
      dataIndex: 'auditState',
      render: (auditState, item) => {
        return ( <div>
          <Button type="primary" onClick={() => confirmDelete(item)}>删除</Button>
          </div>
        )
      }
    },
  ]
  const handleSave = (save) => {
    console.log(save)
    setdataSource(dataSource.map(item => {
      if(item.id === save.id) {
        return {
          id: item.id,
          value: save.value,
          title: save.title
        }
      }
      return item
    }))
    axios.patch(`/categories/${save.id}`, {
      value: save.value,
      title: save.title
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
    setdataSource(dataSource.filter(list => list.id !== item.id))
    axios.delete(`/categories/${item.id}`)
  }

  // 跨级通信对象，供应商组件
  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
  };

  return (
    <div>
        <Table dataSource={dataSource} columns={columns} 
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
        components = {{
          body: {
            row: EditableRow,
            cell: EditableCell,
          }
        }}
      />
    </div>
  )
}
