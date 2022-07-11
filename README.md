

这是一个企业级的后台管理系统---全球新闻发布系统
### 一、技术栈
react + redux+ axios + react-router + webpack + sass

### 二、后端服务：json-server
1. json server 启动服务
`json-server --watch test.json`  可以启动一个服务器
2. 默认端口号：3000
可以加 `--port 8000` 给json server 指定端口号。

### 三、登陆账号/密码
可以自己注册，也可以去db.json 文件里找一个。

### 四、用到的插件和库
1. json-server  在后端返回数据之前，自己用来mock数据。
2. redux   帮助react做全局状态管理
3. redux-thunk，redux-promise   action做异步操作
4. react-router-dom   react路由
5. redux-persistent   redux持久化存储，可以设置黑白名单
6. axios  做数据请求
7. antd   UI库
8. nprogress  进度条UI库
9. craco   用来为react项目配置路径别名
10. react-draft-wysiwyg  富文本编辑器
11.  react-tsparticles canvans粒子效果，用在登陆背景页。