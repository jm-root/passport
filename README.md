# 通行证 passport

通行证系统

## Features

- 账号密码注册和登录

- 手机验证码注册和登录

- 游客登录

- 微信公众号登录

- 微信小程序登录

## 服务说明

- 服务基于[`jm-server`](https://github.com/jm-root/server/tree/master/packages/jm-server)框架建立

- 服务模块集合

    - jm-passport(账号密码注册和登录)
    
        服务依赖
        - [`user`](https://github.com/jm-root/user)(用户账号系统)
        - [`sso`](https://github.com/jm-root/sso)(单点登录系统)
    
    - jm-passport-mobile(手机号+验证码注册和登录)
    
        服务依赖
        - [`user`](https://github.com/jm-root/user)(用户账号系统)
        - [`sso`](https://github.com/jm-root/sso)(单点登录系统)
        - [`sms`](https://github.com/jm-root/sms)(短信发送,用于发送验证码)
        - [`captcha`](https://github.com/jm-root/jm-captcha)(图形验证码)
        - [`verifycode`](https://github.com/jm-root/verifycode)(验证码校验)
        
    - passport-weapp(微信小程序登录)
    
        服务依赖
        - [`sso`](https://github.com/jm-root/sso)(单点登录系统)
        - [`wechatUser`](https://github.com/jm-root/wechat-user)(微信用户登记系统)
        - [`weapp`](https://github.com/jm-root/jm-weapp)(微信小程序登录系统)
        
    - passport-wechat(微信公众号登录)
    
        服务依赖
        - [`sso`](https://github.com/jm-root/sso)(单点登录系统)
        - [`wechatUser`](https://github.com/jm-root/wechat-user)(微信用户登记系统)
        - [`wechat`](https://github.com/jm-root/jm-wechat)(微信公众号登录系统)
    
## 详细API
API文档请参见：[swagger文档](http://apidoc.jamma.cn/?urls.primaryName=passport%202.1)

## 构建运行
````
// 安装依赖包
lerna bootstrap
// 项目启动
npm run start
````

## 部署

采用docker部署，容器默认监听80端口

docker镜像: `jamma/passport`

环境变量见后面的[环境变量](#环境变量)说明
```
docker run -d name passport  jamma/passport
```

## 环境变量

### jm-server

请参考 [jm-server](https://github.com/jm-root/server/tree/master/packages/jm-server)

### jm-server-jaeger

| 配置项               | 默认值         | 描述 |
| :---                 | :---:         | :--- |
|service_name          |"acl"          | 链路追踪登记的服务名称 |
|jaeger                |               |选填, 链路跟踪, 默认不开启, 如配置了链路地址将开启 |

### common

| 配置项               | 默认值         | 描述 |
| :---                 | :---:          | :--- |
|gateway               |"http://gateway"|Gateway服务器Uri| 

### jm-passport-mobile

| 配置项               | 默认值         | 描述 |
| :---                 | :---:         | :--- |
|captcha_key_prefix    |"captcha:"     |图像验证码key前缀|
|disable_captcha       |false          |禁止图形验证码|
|sms_key_prefix        |"sms:"         |短信验证码key前缀|
|sign_name             |               |阿里云短信签名|
|template_code         |               |阿里云短信模板编号|
