#!/bin/bash
# Node.js w/ PM2 项目部署脚本
# Author: Kamas Lau<kamaslau@dingtalk.com>
# Run with "sh -x deploy.sh"
# 局域网环境下需注释掉依赖外网连接的命令

# Project initiation
# rm -f .env
# cp .env_template .env
# echo 'SOME_YAML_STRING' >> .env  # 如有必要，可追加配置信息
# sudo nano .env # 如有必要，可调整具体配置参数
pnpm i
pnpm build

# Process Manager
pm2 delete iot-client
pm2 start npm --watch --name iot-client -- start
pm2 save

# EOL
exit 0
