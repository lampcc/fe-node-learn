Fe-Node-Learn
=============================

> 从0-1,基于node+koa+mongodb开发前端监控系统

**注意：基于Koa2+Mongodb的RESTful API, 需要自行集成jest **

约定使用JSON格式传输数据，POST、PUT、DELET方法支持的Content-Type为`application/x-www-form-urlencoded、multipart/form-data、application/json`可配置支持跨域。非上传文件推荐application/x-www-form-urlencoded。通常情况下返回application/json格式的JSON数据。

可选用redis等非关系型数据库。考虑RESTful API Server的实际开发需要，这里通过sequelize.js作为PostgreSQL, MySQL, MariaDB, SQLite, MSSQL关系型数据库的ORM，如无需关系型ORM，`npm remove sequelize -S`，然后删除`src/lib/sequelize.js`文件。

开发使用说明
------------
后台服务
```
$ npm install
$ npm run dev //可执行npm start跳过ESlint检查
```

前台系统(基于[fe-microservice-base工程](https://github.com/water-design/fe-microservice-base),点击查阅)
```
$ cd web
$ npm install
$ npm start
```

调试说明
--------
后台服务
```
$ npm run dev --debug

Or

$ npm start --debug
```

支持Node.js原生调试功能：https://nodejs.org/api/debugger.html

开发环境部署
------------
后台服务
生成node直接可以执行的代码到dist目录：

```
$ npm run build
```

```
$ npm run production # 生产模式运行

Or

$ node dist/app.js
```
前台系统
```
$ cd web
$ npm run deploy
```
### PM2部署说明

提供了PM2部署RESTful API Server的示例配置，位于“pm2.js”文件中。

```
$ pm2 start pm2.js
```

PM2配合Docker部署说明： http://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/

### Docker部署说明

```
$ docker pull node
$ docker run -itd --name RESTfulAPI -v `pwd`:/usr/src/app -w /usr/src/app node node ./dist/app.js
```

通过'docker ps'查看是否运行成功及运行状态

### Linux/Mac 直接后台运行生产环境代码

有时候为了简单，我们也这样做：

```
$ nohup node ./dist/app.js > logs/out.log &
```

查看运行状态（如果有'node app.js'出现则说明正在后台运行）：

```
$ ps aux|grep app.js
```

查看运行日志

```
$ cat logs/out.log
```

监控运行状态

```
$ tail -f logs/out.log
```

Docker中Nginx运行命令(将上述配置文件任意命名放置于nginx_config目录中即可)：

```
$ docker run -itd -p 80:80 -p 443:443 -v `pwd`/nginx_config:/etc/nginx/conf.d nginx
```

### 关于Token使用的特别说明（JWT身份认证）
`src\app.js`目录中有一行代码：
```.use(jwt({ secret: publicKey }).unless({ path: [/^\/public|\/user\/login|\/assets/] }))```

在path里面的开头路径则不进行身份认证，否则都将进行鉴权。

前端处理方案：
```
/**
 * 基于water-service ng-crud服务封装
 * 本服务不需要provider,使用时直接注入
 * root
 * tree-shaking
 */
import { Injectable } from '@angular/core';
import waterService, { WaterService, ConfDataBase, requestType, responseFilters } from "water-service";
import { NzNotificationService } from 'ng-cosmos-ui';
import { DATABASE } from "../config/app.database";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  private confDataBase: ConfDataBase;
  readonly api = DATABASE.database;
  constructor(private notification: NzNotificationService) {
    this.confDataBase = DATABASE;

    //注册数据库接口配置
    waterService.provider(this.confDataBase);

    //设置请求超时时间
    waterService.timeout = 6000;

    //注册全局数据流中间件
    let token = Math.random() * 10000
    waterService.interceptors.request.use(conf => {
      //设置请求header头(无需设置content-type)
      conf.headers = { Authorization: "Bearer " + token };
      return conf;
    });

  }


  /**
   * common
   * main rewrite request
   * @param type 
   * @param filters 
   */
  request(type: requestType, filters?: responseFilters): Promise<any> {
    return waterService
      .request(
        type,
        filters
      ).catch((e: any) => this.handlerError(e))
  }
  /**
   * common
   * handler error
   * @param e 
   */
  handlerError(e: any) {
    this.notification.create('info', 'Error', `status:${e.status}\nmsg:${e.msg}`)
  }

  /**
   * accept urlBase
   * @param url 
   */
  setUrlBase(url: string) {
    this.confDataBase.baseUrl = url
  }

}

```

大概原理：
通过某个API（通常是登录API）获取成功后的Token，存于本地，然后每次请求的时候在Header带上`Authorization: "Bearer " + token`，通常情况下无需担心本地Token被破解。

引入插件介绍
------------

> 引入插件的版本将会持续更新

引入的插件：  
`koa@2 koa-body@2 koa-router@next koa-static2 koa-compose require-directory babel-cli babel-register babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-2 gulp gulp-eslint eslint eslint-config-standard eslint-friendly-formatter eslint-plugin-html eslint-plugin-promise nodemailer promise-mysql 等`

**koa2**: HTTP框架  
&nbsp;Synopsis: HTTP framework.  
&nbsp;From: https://github.com/koajs/koa v2

**koa-body**: body解析器  
&nbsp;Synopsis: A full-feature koa body parser middleware.  
&nbsp;From: https://github.com/dlau/koa-body

**koa-router**: Koa路由  
&nbsp;Synopsis: Router middleware for koa.  
&nbsp;From: https://github.com/alexmingoia/koa-router/tree/master/

**koa-static2**: 静态资源中间件  
&nbsp;Synopsis: Middleware for Koa2 to serve a folder under a name declared by user.  
&nbsp;From: https://github.com/Secbone/koa-static2

**koa-compose**: 多个中间件组合成一个  
&nbsp;Synopsis: Compose several middleware into one.  
&nbsp;From: https://github.com/koajs/compose

**require-directory**: 递归遍历指定目录  
&nbsp;Synopsis: Recursively iterates over specified directory.  
&nbsp;From: https://github.com/troygoode/node-require-directory

**babel-cli**: Babel编译ES6代码为ES5代码  
&nbsp;Synopsis: Babel is a JavaScript compiler, ES6 to ES5.  
&nbsp;From: https://github.com/babel/babel/tree/master/packages/babel-cli

**babel-register**: Babel开发环境实时编译ES6代码  
&nbsp;Synopsis: Babel hook.  
&nbsp;From: https://github.com/babel/babel/tree/master/packages/babel-cli

**babel-plugin-transform-runtime**: Babel配置ES6的依赖项  
**babel-preset-es2015**: 同上  
**babel-preset-stage-2**: 同上

**gulp**: 基于流的自动化构建工具  
&nbsp;Synopsis: Gulp is a toolkit for automating painful or time-consuming tasks.  
&nbsp;From: https://github.com/gulpjs/gulp

**gulp-eslint**: gulp的ESLint检查插件  
&nbsp;Synopsis: A gulp plugin for ESLint.  
&nbsp;From: https://github.com/adametry/gulp-eslint

**gulp-nodemon**: 修改JS代码后自动重启  
&nbsp;Synopsis: nodemon will watch the files in the directory in which nodemon was started, and if any files change, nodemon will automatically restart your node application.  
&nbsp;From: https://github.com/remy/nodemon

**eslint**: JavaScript语法检查工具  
&nbsp;Synopsis: A fully pluggable tool for identifying and reporting on patterns in JavaScript.  
&nbsp;From:

**eslint-config-standard**: 一个ESlint配置&nbsp;Synopsis: ESLint Shareable Config for JavaScript Standard Style.  
&nbsp;From: https://github.com/feross/eslint-config-standard

**eslint-friendly-formatter**: 使得ESlint提示在Sublime Text或iterm2中更友好，Atom也有对应的ESlint插件。  
&nbsp;Synopsis: A simple formatter/reporter for ESLint that's friendly with Sublime Text and iterm2 'click to open file' functionality  
&nbsp;From: https://github.com/royriojas/eslint-friendly-formatter

**eslint-plugin-html**: 检查HTML文件中的JS代码规范  
&nbsp;Synopsis: An ESLint plugin to extract and lint scripts from HTML files.  
&nbsp;From: https://github.com/BenoitZugmeyer/eslint-plugin-html

**eslint-plugin-promise**: 检查JavaScript promises  
&nbsp;Synopsis: Enforce best practices for JavaScript promises.&nbsp;From: https://github.com/xjamundx/eslint-plugin-promise

**eslint-plugin-promise**: ESlint依赖项  
&nbsp;Synopsis: ESlint Rules for the Standard Linter.&nbsp;From: https://github.com/xjamundx/eslint-plugin-standard

**nodemailer**: 发送邮件  
&nbsp;Synopsis: Send e-mails with Node.JS.  
&nbsp;From: https://github.com/nodemailer/nodemailer

**promise-mysql**: 操作MySQL数据库依赖  
&nbsp;Synopsis: Promise Mysql.  
&nbsp;From: https://github.com/lukeb-uk/node-promise-mysql

**sequelize**: 关系型数据库ORM  
&nbsp;Synopsis: Sequelize is a promise-based ORM for Node.js.  
&nbsp;From: https://github.com/sequelize/sequelize

**mysql**: MySQL库  
&nbsp;Synopsis: A pure node.js JavaScript Client implementing the MySql protocol.  
&nbsp;From: https://github.com/mysqljs/mysql

支持Koa2的中间件列表：https://github.com/koajs/koa/wiki

**其它经常配合Koa2的插件：**

**koa-session2**: Session中间件  
&nbsp;Synopsis: Middleware for Koa2 to get/set session.  
&nbsp;From: https://github.com/Secbone/koa-session2

**koa-nunjucks-2**:  
一个好用的模版引擎，可用于前后端，nunjucks：https://github.com/mozilla/nunjucks

**koa-favicon**:  
Koa的favicon中间件：https://github.com/koajs/favicon

**koa-server-push**:  
HTTP2推送中间件：https://github.com/silenceisgolden/koa-server-push

**koa-convert**: 转换旧的中间件支持Koa2  
&nbsp;Synopsis: Convert koa generator-based middleware to promise-based middleware.  
&nbsp;From: https://github.com/koajs/convert

**koa-logger**: 请求日志输出，需要配合上面的插件使用  
&nbsp;Synopsis: Development style logger middleware for Koa.  
&nbsp;From: https://github.com/koajs/logger

**koa-onerror**:  
Koa的错误拦截中间件，需要配合上面的插件使用：https://github.com/koajs/onerror

**koa-multer**: 处理数据中间件  
&nbsp;Synopsis: Multer is a node.js middleware for handling multipart/form-data for koa.  
&nbsp;From: https://github.com/koa-modules/multer

目录结构说明
------------

```bash
.
├── README.md
├── .babelrc                # Babel 配置文件
├── .editorconfig           # 编辑器风格定义文件
├── .eslintignore           # ESlint 忽略文件列表
├── .eslintrc.js            # ESlint 配置文件
├── .gitignore              # Git 忽略文件列表
├── gulpfile.js             # Gulp配置文件
├── package.json            # 描述文件
├── pm2.js                  # pm2 部署示例文件
├── build                   # build 入口目录
│   └── dev-server.js       # 开发环境 Babel 实时编译入口
├── src                     # 源代码目录，编译后目标源代码位于 dist 目录
│   ├── app.js              # 入口文件
│   ├── config.js           # 主配置文件（*谨防泄密！）
│   ├── plugin              # 插件目录
│       └── smtp_sendemail  # 示例插件 - 发邮件
│   ├── tool                # 工具目录
│       ├── PluginLoader.js # 插件引入工具
│       └── Common.js       # 示例插件 - 发邮件
│   ├── lib                 # 库目录
│   ├── controllers         # 控制器
│   ├── models              # 模型
│   ├── routes              # 路由
│   └── services            # 服务
├── assets                  # 静态资源目录
└── logs                    # 日志目录
```

彻底移除ESlint方法
------------------

删除package.json的devDependencies中所有eslint开头的插件，根目录下的“.eslintignore、.eslintrc.js”文件，并且修改package.json的dev为：

```
'dev': 'gulp start'
```

删除gulpfile.js中的lint、eslint_start两个任务，并且把default改为“gulp.task('default', ['start']”。


