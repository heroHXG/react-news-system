import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined
  
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Space } from 'antd';
const { Header } = Layout;

function TopHeader(props) {
  const {role:{roleName}, username} = JSON.parse(localStorage.getItem('news-token')) 

  const menu = (
    <Menu
     items={[
        {
          key: '1',
          label: roleName
        },
        {
          key: '2',
          label: '退出',
          danger: true,
        },
      ]}

      onClick={(e) => {
        if(e.key==2) {
          localStorage.removeItem('news-token')
          props.history.replace('/login')
        }
      }}
    />
    
  );
      const changeCollapsed = () => {
        props.changeCollapsed()
      }
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
        {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: changeCollapsed
        })}
        <Dropdown overlay={menu}>
        <a onClick={(e) => e.preventDefault()} style={{float: 'right'}}>
          <Space>
              <div >
                欢迎<span style={{color: '#1237dg',fontWeight: 'bolder', margin: '0 2px'}}>{username}</span>回来
              </div>
              <SmileOutlined />
          </Space>
        </a>
      </Dropdown>
  </Header>
  )
}

const mapStateToPros = ({CollapsedReducer}) => {
  return {
    isCollapsed: CollapsedReducer.isCollapsed,
  }
}
const mapDispatchToProps = {
    changeCollapsed() {
      return {
        type: 'change_collapsed',
      }
    }
}
export default connect(mapStateToPros,mapDispatchToProps )(withRouter(TopHeader)) 