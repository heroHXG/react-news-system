
import { Descriptions, PageHeader } from 'antd';
import {useEffect, useState} from 'react'
import moment from 'moment'

import axios from 'axios'

export default function NewsPreview(props) {
    const [dataSource, setdataSource] = useState(null)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            setdataSource(res.data)
        })
    
    }, [props, props.match.params.id])
    const auditMap = {
        '0': '未审核',
        '1': '审核中',
        '2': '已通过',
        '3': '未通过'
    }
    const publishMap = {
        '0': '未发布',
        '1': '待发布',
        '2': '已上线',
        '3': '已下线'
    }
    const colorList = ['black', 'orange', 'green', 'red']
  return <div className="site-page-header-ghost-wrapper">
    {
        dataSource &&  <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={dataSource?.title}
            subTitle={dataSource.category.title}
        >
            <Descriptions size="small" column={3}>
                <Descriptions.Item label="创建者">{dataSource.author}</Descriptions.Item>
                <Descriptions.Item label="创建时间">
                    <a>{moment(dataSource.createTime).format("YYYY/MM/DD HH:mm:ss")}</a>
                </Descriptions.Item>
                <Descriptions.Item label="发布时间">{dataSource.publishTime ? moment(dataSource.publishTime).format("YYYY/MM/DD HH:mm:ss") : '-'}</Descriptions.Item>
                <Descriptions.Item label="区域">{dataSource.region}</Descriptions.Item>
                <Descriptions.Item label="审核状态">
                    <span style={{color: colorList[dataSource.auditState]}}>{auditMap[dataSource.auditState]}</span>
                </Descriptions.Item>
                <Descriptions.Item label="发布状态" style={{color: 'red'}}>
                     <span style={{color: colorList[dataSource.publishState]}}> {publishMap[dataSource.publishState]}</span>
                </Descriptions.Item>
                <Descriptions.Item label="访问数量">{dataSource.view}</Descriptions.Item>
                <Descriptions.Item label="点赞数量">{dataSource.star}</Descriptions.Item>
                <Descriptions.Item label="评论数量">xxxxxx</Descriptions.Item>
    
            </Descriptions>
        </PageHeader>
    }
   
    { dataSource && 
        <div style={{border: '1px solid #ccc', marginTop: '10px', padding: '10px 24px'}}
         dangerouslySetInnerHTML={{
            __html:  dataSource.content
        }}></div>
    }

  </div>
}

