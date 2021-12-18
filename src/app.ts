'use strict'

import cronjob from './cronjob'
import dotenv from 'dotenv'

// 在控制台中标识程序起始
console.log(
  '\x1b[32m%s\x1b[0m',
  `\n\n🚀 ============================\n\n✨ Node.js${process.version} is started under ${process.env.NODE_ENV as string}\n`
)

const isDev = process.env.NODE_ENV === 'development'

// 载入.env环境配置文件
dotenv.config()
// console.log('process.env: ', process.env)

/**
 * 计划任务
 */
 cronjob.startAll()
