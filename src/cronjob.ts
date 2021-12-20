/**
 * 计划任务
 *
 * https://www.npmjs.com/package/node-cron
 */
import { getTimeString } from './utils'
import { dht } from './sensor'
import nodeCron from 'node-cron'

// 控制台输出前缀
const consolePrefix = '⏱ cron job: '

/**
 * 任务计划
 */
const plans = {
  minutely: async (): Promise<void> => {
    console.log(`${consolePrefix} minutely: `, getTimeString())

    dht.read11()
  },
  hourly: async (): Promise<void> => {
    console.log(`${consolePrefix} hourly: `, getTimeString())
  },
  daily: async (): Promise<void> => {
    console.log(`${consolePrefix} daily: `, getTimeString())
  }
}

/**
 * 启动所有计划任务
 */
const startAll = (): void => {
  console.log('\x1b[32m%s\x1b[0m', '⏱ cron job initiated')

  try {
    dht.read11()

    nodeCron.schedule('0 * * * * *', plans.minutely)
    nodeCron.schedule('0 0 * * * *', plans.hourly)
    nodeCron.schedule('0 0 0 * * *', plans.daily)
  } catch (error) {
    console.error('startAll error: ', error)
  }
}

export default { startAll }
