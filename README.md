# 通行证 passport

通行证系统

## Features

- 账号密码注册和登录

- 手机验证码注册和登录

- 游客登录

- 微信公众号登录

- 微信小程序登录

## 部署

采用docker部署，容器默认监听80端口

环境变量见后面的[环境变量](#环境变量)说明
```
docker run -d name passport  jamma/passport
```

## 环境变量

### jm-server

请参考 [jm-server](https://github.com/jm-root/jm-server/tree/master/packages/jm-server)

### jm-server-jaeger

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|service_name|"acl"| 链路追踪登记的服务名称 |
|jaeger| |jaeger服务器Uri| 链路追踪服务器

### common

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|gateway|"http://gateway"|Gateway服务器Uri| 

### jm-passport

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |

### jm-passport-mobile

| 配置项 | 默认值 | 描述 |
| :-: | :-: | :-: |
|captcha_key_prefix|"captcha:"|图像验证码key前缀|
|disable_captcha|false|禁止图形验证码|
|sms_key_prefix|"sms:"|短信验证码key前缀|
|sign_name||阿里云短信签名|
|template_code||阿里云短信模板编号|
