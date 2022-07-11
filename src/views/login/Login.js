import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import './Login.css'
import Particles from "./Particles";
import axios from 'axios'

export default function Login(props) {
  const onFinish = (values) => {
    axios.get(`http://localhost:8000/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res => {
      if(res.data.length === 0) {
        message.error("用户名或密码不匹配")
      }else{
        localStorage.setItem('news-token', JSON.stringify( res.data[0]))
        props.history.push('/')
      }
    })
  }
  return (
    <div style={{background: 'rgba(35, 39,65)', height: '100%'}}>

      <Particles/>

      <div className='form-container'>
        <div className='login-title'>全球新闻发布管理中心</div>
         <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          Forgot password
        </a>
      </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
       </div>
    </div>
  )
}
