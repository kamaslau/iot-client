/**
 * 计划任务
 *
 * https://www.npmjs.com/package/node-cron
 */
import { getTimeString } from './utils'
import { dht } from './sensor'
import nodeCron from 'node-cron'

import fetch from 'node-fetch'
import { URLSearchParams } from 'url'

// 控制台输出前缀
const consolePrefix = '⏱ cron job: '

// 读取传感器数据
const reportSensor = async (): Promise<void> => {
  const readings = await dht.read()

  if (readings.message?.length > 0) return 

  const params = { ...readings.data, timestamp: readings.timestamp }
  console.log('params: ', params)

  let result: any = null

  try {
    result = await fetch(
      'https://api.liuyajie.com/sensor_record',
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        body: new URLSearchParams(params).toString()
      }
    ).then((res) => res.json())
  } catch (error) {
    console.error('reportSensor error: ', error)
  }

  console.log('reportSensor result: ', result)
}

/**
 * 任务计划
 */
const plans = {
  minutely: async (): Promise<void> => {
    console.log(`${consolePrefix} minutely: `, getTimeString())
    await reportSensor()
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
const startAll = async (): Promise<void> => {
  console.log('\x1b[32m%s\x1b[0m', '⏱ cron job initiated')

  try {
    await reportSensor()

    nodeCron.schedule('0 * * * * *', plans.minutely)
    nodeCron.schedule('0 0 * * * *', plans.hourly)
    nodeCron.schedule('0 0 0 * * *', plans.daily)
  } catch (error) {
    console.error('startAll error: ', error)
  }
}

export default { startAll }
