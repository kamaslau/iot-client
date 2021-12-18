#!/bin/bash
# Node.js w/ PM2 项目部署脚本
# Author: Kamas Lau<kamaslau@dingtalk.com>
# Run with "sh -x deploy.sh"
# 局域网环境下需注释掉依赖外网连接的命令

# [Initiation] Environment
# nvm install stable
# nvm alias default stable
npm i -g npm@latest

# Project initiation
npm i

# Process Manager
npm i -g pm2@latest
pm2 update
pm2 delete iot-client
pm2 start npm --watch --name "iot-client" -- start

# EOL
exit 0
