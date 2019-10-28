# aliddns-node-client
阿里云DDNS nodejs 实现监听服务器ip变化 


# 使用教程


### 1、安装nodejs环境

### 2、clone 项目代码

### 3、安装依赖
```
cd aliddns-node-client
```
```
npm install
```

### 4、修改config.json 
    accessKeyId       你的阿里云accessKeyId
    accessKeySecret   你的阿里云accessKeySecret
    domain            顶级域名  例如  baidu.com
    child             二级域名  例如  cloud  (cloud.baidu.com)
    
### 5、运行程序
```
npm run start
```

### 6、后台运行 
```
npm install -g pm2
```
随后执行 
```
pm2 start ./src/index.js --name aliddns-node-client
```

### 7、开机自启动 
```
sudo pm2 startup
sudo pm2 save 
``` 
重启机器验证
```
sudo systemctl reboot 
```
### 8、取消开机自启动
```
sudo pm2 unstartup systemd
```
