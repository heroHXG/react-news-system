import React from 'react'
import './index.css'

import {withRouter} from 'react-router-dom'
import { useEffect,useRef, useState } from 'react';
import {connect} from 'react-redux'

import {
  AppstoreOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  MailOutlined,
  HeartOutlined,
  IdcardOutlined,
  NotificationOutlined, ReadOutlined, RocketOutlined, ScheduleOutlined, ShopOutlined, SmileOutlined,
  TrophyOutlined, StarOutlined, TableOutlined
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import axios from 'axios';
const { Sider } = Layout;

function SideMenu(props) {
  
  let menulist = useRef([])
  const [newMenu, setNewMenu] = useState([])
  const {role:{rights}} = JSON.parse(localStorage.getItem('news-token'))

  useEffect(() => {
    axios.get('http://localhost:8000/rights?_embed=children').then(res => {
      menulist.current = res.data
     //字段pagepermission表示是否出现在sidemenu中
     setNewMenu( getItems(menulist.current))

    })
  }, [])
  
  const icons = {
    '/home': <PieChartOutlined />,
    '/user-manage': <DesktopOutlined />,
    '/user-manage/list': <ContainerOutlined/>,
    '/right-manage': <MenuFoldOutlined/>,
    '/right-manage/role/list': <MailOutlined />,
    '/right-manage/right/list': <AppstoreOutlined />,
    '/news-manage':<HeartOutlined />,
    '/news-manage/add': <ReadOutlined />,
    '/news-manage/draft': <RocketOutlined />,
    '/news-manage/category': <ScheduleOutlined />,
    '/audit-manage': <IdcardOutlined />,
    '/audit-manage/audit': <ShopOutlined />,
    '/audit-manage/list': <SmileOutlined />,
    '/publish-manage': <NotificationOutlined />,
    '/publish-manage/unpublished': <TrophyOutlined />,
    '/publish-manage/published': <StarOutlined />,
    '/publish-manage/sunset': <TableOutlined />
  }

  function getIcon(item) {
    return icons[item.key]
  }
  
  const checkPagePermission = (item) => {
    /*pagepermisson 为1表示有显示在页面上的权限。这里还要加上当前用户的权限列表一起做判断。*/ 
    return item.pagepermisson && rights.includes(item.key)
  }

  function childlist(list) {
    return list.map(item => checkPagePermission(item) && {
      label: item.title,
      key: item.key,
      icon: getIcon(item)
    })
  }

  const getItems =  function(menulist) {
    let newList =  menulist.map(item => 
      checkPagePermission(item) && {
        label: item.title,
        key: item.key,
        icon: getIcon(item),
        children: item.children?.length>0? [].concat(...childlist(item.children)): null
      }
    )
    return newList
  }
  
  function clickItem({ key, keyPath }) {
    props.history.push(key)
  }
  return (
    <div>
      {/* collapsible	是否可收起,默认false */}
      <Sider trigger={null} collapsible={true} collapsed={props.isCollapsed} >
        <div style={{display: 'flex', height: '100%', flexDirection: 'column'}}>
            <div className="logo">全球新闻发布系统</div>
            <div style={{flex: '1', overflow: 'auto'}}>
                <Menu
                  defaultSelectedKeys={['/home']}
                  selectedKeys={props.location.pathname}
                  defaultOpenKeys={['/'+props.location.pathname.split('/')[1]]}

                  mode="inline"
                  theme="dark"
                  inlineCollapsed={true}
                  items={newMenu}
                  onClick= {clickItem}
                />
            </div>
        </div>
      </Sider>
    </div>
  )
}
const mapStateToProps = ({CollapsedReducer}) => {
  return {
    isCollapsed: CollapsedReducer.isCollapsed

  }
}
export default connect(mapStateToProps)(withRouter(SideMenu))