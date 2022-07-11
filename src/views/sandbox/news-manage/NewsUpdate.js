import React, {useState, useEffect, useRef} from 'react'
import style from './News.module.css'
import axios from 'axios'
import NewsEditor from './NewsEditor'

import {PageHeader, Steps, Button, message, Input, Form, Select, notification} from 'antd'
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
    const [current, setCurrent] = useState(0);
    const [categories, setcategories] = useState([])
    const newsForm = useRef(null)
    const [formInfo, setformInfo] = useState({})
    const [content, setcontent] = useState('')

    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category&_expand=role`).then(res => {
            const {title, categoryId, content} = res.data
            newsForm.current.setFieldsValue({
                title,
                categoryId
            })
            setcontent(content)
        })
    
    }, [props, props.match.params.id])

    useEffect(() => {
        axios.get('/categories').then(res => {
            setcategories(res.data)
        })
    }, [])
    const steps = [
        {
          title: '基本信息',
          content: '新闻标题，新闻分类',
        },
        {
          title: '新闻内容',
          content: '新闻主体内容',
        },
        {
          title: '新闻提交',
          content: '保存草稿或者提交审核',
        },
    ];

    const next = () => {
        if(current == 0) {
            newsForm.current.validateFields().then(res => {
                setformInfo(res)
                setCurrent(current + 1);

            }).catch(error => {
                console.log(error)
            })
        }else {
            if(content === '' || content.trim() === '<p></p>') {
                message.error('新闻内容不能为空')
            }else{
                setCurrent(current + 1);
            }
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

  
    const handleSave = (auditState) => {
        axios.patch(`/news/${props.match.params.id}`, {
            ...formInfo,
            'content': content,
            "auditState": auditState,  //传0表示草稿箱，传1表示提交审核
            "createTime": Date.now(),
           
        }).then(res=>{
            props.history.push(auditState===0 ? '/news-manage/draft': '/audit-manage/list')
            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0 ? '草稿箱': '审核列表'}中查看您添加的内容`,
                placement: 'top'
            });
        })
    }
  return (
    <div>
        <PageHeader
            className="site-page-header"
            onBack={() => props.history.goBack()}
            title="更新新闻"
            subTitle="This is a subtitle"
        />
        <Steps current={current}>
            {
                steps.map(item => {
                    return <Step key={item.title} title={item.title} description={item.content} />
                })
            }
        </Steps>
        <div className={style.news_content}>
            <div className={current===0 ? '' : style.hidden}>
                <Form
                    ref={newsForm}
                    name="basic"
                    labelCol={{
                        span: 4,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    autoComplete="off"
                >
                    <Form.Item
                        label="新闻标题"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="新闻分类"
                        name="categoryId"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            >
                                {categories.map(item => {
                                    return <Option key={item.id} value={item.id}>{item.title}</Option>
                                })}
                            
                        </Select>
                    </Form.Item>
                </Form>
            </div>
            <div className={current===1 ? '' :  style.hidden}>
                <NewsEditor content={content} getContent={(value) => {
                    setcontent(value)
                }}></NewsEditor>
            </div>
            <div className={current===2 ? '' :  style.hidden}>
                3333
            </div>
        </div>

        <div className="steps-action" style={{display: 'flex'}}>
            {current > 0 && (
                <Button
                    type="primary"
                    style={{ 
                    margin: '0 8px',
                    }}
                    onClick={() => prev()}
                >
                    上一步
                </Button>
            )}
            {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                    下一步
                </Button>
            )}
            {current === steps.length - 1 && (
                <div style={{display: 'flex'}}>
                    <Button type="primary" style={{marginRight: '5px'}} onClick={() => handleSave(0)}>
                        保存草稿箱
                    </Button>
                    <Button danger onClick={() =>  handleSave(1)}>提交审核</Button>
                </div>
            )}
        </div>

    </div>
  )
}
