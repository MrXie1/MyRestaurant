# CreatorWsSaveJS

 
对应的相关客户端代码  

## 主要功能  
    * 存储或读取游戏存档数据  
    * 存储或读取微信小游戏好友分享帮助
    * 存储或读取存取个人账号昵称头像信息 
    * 微信小游戏子游戏审核版本的配置选项  
  

## 项目结构
MtilsJS  
工具类
辅助工具类 提供 sha256，sha1，MD5 计算 hex_sha256 hex_sha1 hex_md5
base64编码解码 base64_decode base64_encode
zip压缩解压 zipstr unzipstr  

pakoJS  
字符串压缩库 
字符串压缩解压 ，已经在MtilsJS中封装成zipstr和unzipstr函数 

wsLoginToolsJS  
格式解析封装类 封装接口协议

websocketJS  
网络通信websocket相关实现，提供主要的实现功能实现 


### 主要流程

1. 下载所有js文件，添加到creator项目中  
2. 引入websocketJS模块  
3. 设置GAEM_NAME、 GAME_ID 、player_id参数值  
4. 构造websocketJS对象，连接服务器，调用相关功能函数，关闭连接  
5. 微信开发者工具 域名校验 设置

## 实现原理
客户端利用websocket和服务端进行数据交互，websocketJS用于开启websocket连接 ，wsToolsJS用于封装解析消息格式

## 压缩函数说明

```js
// 引用文件
var Mtils = require("MtilsJS");
// xxxxxx
// xxxxx

// 压缩字符串，不支持中文
// 调用一次 大概0.5ms 长度超过500时再考虑调用，返回的是base64字符串 可以直接发送给服务端 或者本地存储
var textStr="xxxxxxxxxxxxxxxxxxx"
var zip_str = Mtils.zipstr(textStr)

// 解压缩字符串
// 调用一次 大概0.12ms ， 输入应该是上面压缩生成的base64字符串
var unzipstr = Mtils.unzipstr(zip_str)

```