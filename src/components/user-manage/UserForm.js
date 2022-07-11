import React, {forwardRef, useState, useEffect} from 'react'

import { Form, Input, Select } from 'antd'
const { Option } = Select;

/*
因为表单验证要拿到表单数据，所以用ref传递值。用高阶组件 forwardRef 透传 ref。
*/ 
const UserForm = (props, ref) => {
   
    const [regionDisabled, setregionDisabled] = useState(false)
    useEffect(() => {
        setregionDisabled(props.isUpdateDisabled)
    }, [props.isUpdateDisabled])
    
    const {roleId, region: userRegion} = JSON.parse(localStorage.getItem('news-token'))
    const roleObj = {
      "1": "superadmin",
      "2": 'admin',
      '3': 'editor'
    }
    const checkRegionDisabled = (region) => {
      if(props.isUpdate) {
        // 更新弹窗的region-select
        if(roleObj[roleId] ==='superadmin') {
          return false
        }else{
          // 用户管理的更新form这里只有“admin”能进来，所以直接返回true(修改用户region不可更改)
          return true
        }
      }else{
        //新增状态的region-select
        if(roleObj[roleId] ==='superadmin') {
          return false
        }else{
          // 用户管理的新增form这里只有“admin”能进来，只能选择“admin”同地区的
          return region !== userRegion
        }
      }
    }
    const checkRoleDisabled = (roleType) => {
      if(props.isUpdate) {
        if(roleObj[roleId] ==='superadmin') {
          return false
        }else{
          return true
        }
      }else{
        if(roleObj[roleId] ==='superadmin') {
          return false
        }else{
          return !(roleObj[roleType] === 'editor')
        }
      }
    }
  return (
    <Form
    ref={ref}
    layout="vertical"
  >
    <Form.Item
      name="username"
      label="用户名"
      rules={[
        {
          required: true,
          message: 'Please input the title of collection!',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="password"
      label="密码"
      rules={[
        {
          required: true,
          message: 'Please input the title of collection!',
        },
      ]}
    >
      <Input />
    </Form.Item>
    <Form.Item
      name="region"
      label="区域"
      rules={regionDisabled? []: [
        {
          required: true,
          message: 'Please input the title of collection!',
        },
      ]}
    >
       <Select
          allowClear
          disabled={regionDisabled}
        >
          {
            props.regionList.map(item => {
              return <Option key={item.id} value={item.value} disabled={checkRegionDisabled(item.value)}>{item.title}</Option>
            })
          }
        </Select>
    </Form.Item>
    <Form.Item
      name="roleId"
      label="角色"
      rules={[
        {
          required: true,
          message: 'Please input the title of collection!',
        },
      ]}
    >
       <Select
          allowClear
          onChange={(value) => {
            if(value == 1) {
                setregionDisabled(true)
                ref.current.setFieldsValue({
                    // region 是之前设定好的 Form.Item 的name值。
                    region: ''
                })
            }else{
                setregionDisabled(false)
            }
          }}
        >
          {
            props.roleList.map(item => {
              return <Option key={item.id} value={item.roleType} disabled={checkRoleDisabled(item.roleType)}>{item.roleName}</Option>
            })
          }
        </Select>
    </Form.Item>
  </Form>
  )
}

export default forwardRef(UserForm)