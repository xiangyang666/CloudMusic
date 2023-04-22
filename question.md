# 本人在项目中存在的问题（如下）

# 百度 AI 开放平台

https://ai.baidu.com/

# 鼠标点击页面出现爱心

https://www.douyin.com/user/MS4wLjABAAAAI79tehrRb9-JYi8387gwzgoPluUPp6qpl9aRrj9LFnRfWY--3IAMPgP38QamVGd2?modal_id=7184075244443864381&showTab=favorite_collection

# 图片聚焦效果

https://www.douyin.com/user/MS4wLjABAAAAI79tehrRb9-JYi8387gwzgoPluUPp6qpl9aRrj9LFnRfWY--3IAMPgP38QamVGd2?modal_id=7183866961393126714&showTab=favorite_collection

# draggable

拖动库

# 浏览器，禁用右键、禁用保存、禁用控制台和打印（开发模式不需要禁用，但生产模式需要禁用(给用户带来良好体验)）

文件夹说明：
---> .env.development（开发环境）
---> .env.production（生产环境）
---> .env.test（测试环境）这个知道就行

获取数据 process.env.变量
例如：
const env = process.env.VUE_APP_MODE
if (env === 'development') {
console.log('开发模式')
} else {
console.log('生产模式')
}

https://zhuanlan.zhihu.com/p/387477392

# 【键盘事件 JS】关于 keyCode 事件问题

https://blog.csdn.net/weixin_45776308/article/details/126174418

# 获取 ip 归属地 api 接口

http://whois.pconline.com.cn/ipJson.jsp?ip=xxx.xxx.xxx.xxx&json=true

# 获取汉字拼音互转

http://api.k780.com/?app=code.hanzi_pinyin&typeid=1&wd=%E9%9C%80%E8%A6%81%E8%BD%AC%E6%8D%A2%E7%9A%84%E6%B1%89%E5%AD%97&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=xml

# 解决 natapp 打开网页显示 Invalid Host header 问题

https://blog.csdn.net/qq_52016756/article/details/125987305

# Vue 输入事件方法中使用防抖失效问题

https://blog.csdn.net/qq_40693660/article/details/127785725

# 如何导出和导入默认函数

# vue3 中的组件通信技术

修改 props 出现该属性只读警告（解决：https://blog.csdn.net/qq_37054845/article/details/123211062）

# '@/views/audio'中为什么要在外面套一层 div 即可解决，vue3 不是在外层不加任何一个元素包裹也行呀，为什么不加会出现警告

`[Vue warn]: Extraneous non-props attributes (class) were passed to component but could not be automatically inherited because component renders fragment or text root nodes`

# 点击每一行播放音乐然后加上样式（一定要记得）

# audio.value?.currentTime ?. 属性学习一下

# Vue keyframe 动画不生效 https://blog.csdn.net/weixin_44240581/article/details/124967493

# 实现 CSS 隐藏滚动条并可以滚动内容

https://mp.weixin.qq.com/s?__biz=MjM5MDA2MTI1MA==&mid=2649109058&idx=3&sn=a2387cdd147c63dd947888969b44677a&chksm=be5815ef892f9cf9f53a1b1f19b3f1c75805b5952505b093cd90d329db00244ca97b4f7eae0c&scene=27

# 在 vue templeate 中给元素动态加背景图片

https://www.jb51.net/article/145410.htm

# 了解 background-clip: text;属性

# JavaScript —— 生成随机数

https://blog.csdn.net/qq_45902692/article/details/123882071

# js 控制 audio

https://blog.csdn.net/wb_javaScript/article/details/126965475

# 更改 ElementPlus 默认样式的方法

https://blog.csdn.net/qq_40864647/article/details/126224084

# 网易云音乐接口的一些问题

```关于调用登陆接口-460网络拥挤的问题解答：最开始我也是直接使用网易云的手机登陆地址请求，一直出现网络拥挤情况，去了百度和csdn搜索，也没能到好的解决方法然后我用postman直接带参数请求发现接口调用成功？！最神奇的是，postman请求一次后，浏览器再次请求居然也成功了我猜这应该和缓存有关，具体不是很清楚关键来了，我看了两次请求的响应头（一次失败，一次成功），发现access-control-allow-origin: http://localhost:8080【败access-control-allow-origin: *【成功】明显是涉及到了跨域问题，后面我去了网易云API仔细看了下接口文档，调用前须知里有一条：如果是跨域请求 , 请在所有请求带上 xhrFields: { withCredentials: true } (axios 为 withCredentials: true, Fetch API 为 fetch(url, { credentials: 'include' })), 或直接手动传入 cookie (参见 登录), 否则 可能会因为没带上 cookie 导致 301, 具体例子可看 public/test.html, 访问http://localhost:3000/test.html(默认端口的话) 例子使用 jQuery 和 axios没错，只要你用的是axios，在登陆请求里加上配置withCredentials: true就好！就能成功登陆了考虑到登陆之后要获取用户的信息，如获得账号信息(登陆)：原请求地址为/user/account这里需要在vuex里新增一个变量把登陆请求的cookies存储起来，如：let res = await getPhoneLogin(value)context.state.Cookies = await res.data.cookie之后请求用户信息就带上Cookies就好，如：url:'/user/account?cookie=${cookies}'

```

# 报错 npm ERR! code ERESOLVE npm ERR! ERESOLVE unable to resolve dependency tree 报错解决办法（安装依赖包出现：this command with --force, or --legacy-peer-deps）

https://blog.csdn.net/angrynouse/article/details/125325027
https://blog.csdn.net/qq_40190624/article/details/123257107
https://blog.csdn.net/qq_46687516/article/details/120324260

# 快速删除 node_modules 并清理缓存

https://www.jianshu.com/p/6db1538d9760

# 定时清理 Vue 项目依赖包 node_modules 中的缓存文件.cache

https://www.shouxicto.com/article/4643.html

# 安装指定版本的 npm

https://www.jianshu.com/p/e24f9f354cb6

# el-table 如何在@row-click 里获取点击行的 index 索引

https://blog.csdn.net/weixin_43258184/article/details/124154501

# Vue 判断对象是否为空

http://www.qb5200.com/article/537354.html

# Vue 无法访问.env.development 中自定义的 变量

https://blog.csdn.net/wgf1997/article/details/114384472

# vue 项目--open 打开 0.0.0.0 网址如何修改

https://blog.csdn.net/weixin_41179697/article/details/125078960

# VUE 跨域、常用解决跨域的方法

https://blog.csdn.net/codingLeader/article/details/122712670

# vue3 defineEmits的使用
https://blog.csdn.net/weixin_47228574/article/details/128144067

# css:网页引入字体@font-face以及动态加载字体
https://blog.csdn.net/creatlh/article/details/128643506
https://blog.csdn.net/mouday/article/details/126410418

# vue项目引入彩色iconfont图标
https://blog.csdn.net/yummy_yuyu/article/details/123810717