
import React, {useEffect, useState} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import { Spin } from 'antd';

import Home from '@views/sandbox/Home'
import UserList from '@views/sandbox/user-manage/UserList'
import RoleList from '@views/sandbox/right-manage/RoleList'
import RightList from '@views/sandbox/right-manage/RightList'
import NoPermission from '@views/sandbox/NoPermission'

import NewsAdd from '@views/sandbox/news-manage/NewsAdd'
import NewsDraft from '@views/sandbox/news-manage/NewsDraft'
import NewsCategory from '@views/sandbox/news-manage/NewsCategory'
import NewsPreview from '@views/sandbox/news-manage/NewsPreview'
import NewsUpdate from '@views/sandbox/news-manage/NewsUpdate'

import Audit from '@views/sandbox/audit-manage/Audit'
import AuditList from '@views/sandbox/audit-manage/AuditList'

import Unpublished from '@views/sandbox/publish-manage/Unpublished'
import Published from '@views/sandbox/publish-manage/Published'
import Sunset from '@views/sandbox/publish-manage/Sunset'

function NewsRouter(props) {
    const LocalRouterMap = {
        '/home': Home,
        '/user-manage/list': UserList,
        '/right-manage/role/list': RoleList,
        '/right-manage/right/list': RightList,
        '/news-manage/add': NewsAdd,
        '/news-manage/draft': NewsDraft,
        '/news-manage/category': NewsCategory,
        "/news-manage/preview/:id": NewsPreview,
        "/news-manage/update/:id": NewsUpdate,

        '/audit-manage/audit': Audit,
        '/audit-manage/list': AuditList,
        '/publish-manage/unpublished': Unpublished,
        '/publish-manage/published': Published,
        '/publish-manage/sunset': Sunset
    
    }
    const [backRouteList, setbackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('http://localhost:8000/rights'),
            axios.get('http://localhost:8000/children'),
        ]).then(res => {
            // 得到27个扁平化的数据
            setbackRouteList([...res[0].data, ...res[1].data])
        })
     
    }, [])
    const {role: {rights}} = JSON.parse(localStorage.getItem('news-token'))
    const checkRoute = (item) => {
        // 验证本地是否有当前路由的映射组件 及 该路由的权限pagepermisson 是否已经开了
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    const checkUserPermission = (item) => {
        // 判断当前用户的权限列表里是否包含当前路由
        return rights.includes(item.key)
    }
  return (
    <div>
        <Spin size="large" spinning={props.loading}>
            <Switch>
                {
                    backRouteList.map(list => {
                        if(checkRoute(list) && checkUserPermission(list)) {
                            return  <Route path={list.key} key={list.key} component={LocalRouterMap[list.key]} exact></Route>
                        }else {
                            return null
                        }
                    })
                }

                <Redirect from='/' to='/home' exact/>
                {
                    backRouteList.length > 0 && <Route path='*' component={NoPermission} />
                }
            </Switch>
        </Spin>
    </div>
  )
}

const mapStateToProps = ({LoadingReducer}) => {
    return {
        loading: LoadingReducer.loading
    }
}
export default connect(mapStateToProps)(NewsRouter)