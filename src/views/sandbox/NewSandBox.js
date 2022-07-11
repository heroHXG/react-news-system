
import React, { useState, useEffect } from 'react';

import SideMenu from '../../components/sandbox/SideMenu'
import TopHeader from '../../components/sandbox/TopHeader'
import NewsRouter from '../../components/sandbox/NewsRouter'

import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

import './NewSandBox.css'

import { Layout } from 'antd';
const {  Content } = Layout;

export default function NewSandBox() {
  Nprogress.start()
  // 在组件渲染完成的时候去掉nprogress效果。
  useEffect(() => {
    Nprogress.done()
  },)
  
  return (
    <Layout>
        <SideMenu/>
        <Layout className="site-layout">
            <TopHeader />
                <Content
                    className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: 'auto'
                    }}
                    >
                    <NewsRouter/>
                </Content>
        </Layout>
    </Layout>
  )
}
