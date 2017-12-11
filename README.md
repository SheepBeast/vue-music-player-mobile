## Vue.js音乐播放器

### demo示例([在线演示](http://39.106.10.121/dist/static/index.html))
![首页](http://39.106.10.121/images/home.png "首页")
![播放器](http://39.106.10.121/images/musicplayer.png "播放器")

### 项目简介
1.  基于[vue](https://cn.vuejs.org/) + [vuex](https://vuex.vuejs.org/zh-cn/) + [vue-router](https://router.vuejs.org/zh-cn/) + [vue-resource](https://www.npmjs.com/package/vue-resource)开发
2.  实现专辑、歌单、歌手、用户等信息的展示和音乐播放功能
3.  重构router.push和router.back，实现数据预加载和灵活的转场
4.  自定义组件、指令（如懒加载）、插件（如图片浏览器）等，减少第三方依赖项
5.  合理缓存数据，减少HTTP请求数和页面渲染时间

### 更新日志
#### 2017.12.11
* 将评论过滤函数抽离到util文件中
* 增加各页面相关的mixins文件
* 优化photoBrowser的动画流程
* 优化页面转场的流程

#### 2017.12.07
* 增加图片浏览器插件(photoBrowser)
* 增加"动态"页面
* 首页tabs部分增加切换动效
* 优化评论时间显示规则
* 各页面的评论列表项的排序方式更改为随机方式

#### 2017.12.05
* 增加首页、搜索页、播放页等页面
* 增加各页面相应store文件
* 增加路由router，重构vue-router实例
* 增加自定义组件、指令和插件
* 增加各页面、组件、指令和插件相关的样式
* 增加Cache类，实现各页面对请求的非重复数据作缓存
* 增加API文件，将所有api独立抽离在该文件中
* 增加demo展示页和浏览器环境检测脚本
* 配置生产环境和开发环境的数据源地址，调用api时统一使用process.env.SERVER

### 下载安装
``` shell
$ git clone https://github.com/SheepBeast/vue-music-player.git
$ npm install
```

### 运行
``` shell
$ npm run dev
```
访问地址：[http://localhost:8080/](http://localhost:8080/)

### 注意事项
本地测试需[music-api](https://github.com/SheepBeast/music-api)作为数据源支持
