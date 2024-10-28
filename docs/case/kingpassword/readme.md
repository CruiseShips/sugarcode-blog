# kingpassword

## 项目架构
该项目为前后端分离式项目，通过 HTTP 进行通讯数据。

后端语言：Java（Version 17）

后端主要使用框架
* Springboot（Version 3.3.3）
* mybatis-plus（Version 3.5.7）

前端主要使用框架
* Vue（Version 3.4.37）
* Vite（Version 5.4.1）
* Element Plus（Version 2.8.3）

数据库
* MySQL（Version 8.0.21）

## 其他技术功能点


## 项目 Git 地址
https://gitee.com/powerRock/sugarcode-kingpassword

## 项目使用说明（个人版）

1. 前端登录系统后，可以进行注册账号。密码不需要自己设定，系统会随机生成并发送给用户。
2. 进入系统后，可以创建密码组，方便管理密码。
3. 在密码组下面可添加密码。并且为密码添加详细账号信息（一个密码可以添加多个账号信息）、其他信息等。
4. 对于常用的密码可以收藏，默认可以收藏 50 个，被收藏的密码可以在首页看到。
5. 系统有随机Miami生成，可直接复制使用。

## 项目运行
- **前端**：
进入项目：sugarcode-kingpassword-individual-web
打开 DOS 命令窗口执行如下命令
```
npm install

npm run dev
```

- **数据库**：
打开 MySQL，执行脚本：kingpassword-individual.sql

进入 t_users 表，删除数据。

- **后端**：
进入项目：sugarcode-kingpassword-server
运行 sugarcode-kingpassword-individual 项目即可（Spring Boot 项目）。
