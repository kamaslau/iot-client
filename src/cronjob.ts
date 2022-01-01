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

// 传感器类型定义
interface Sensor {
  id: string | null
  model: number
  gpio: number
  url: string
}

// 传感器
let sensor: Sensor | null

// 读取传感器数据
const reportSensor = async (sensor: Sensor): Promise<void> => {
  // console.log('reportSensor: ', process.env, sensor)

  // 读取数据
  const readings = await dht.read(sensor.model, sensor.gpio)
  if (readings.message?.length > 0) return

  // 上报数据
  if (sensor.url.length === 0) return

  const params = {
    content: JSON.stringify({
      timestamp: readings.timestamp,
      sensor_id: sensor.id,
      ...readings.data
    })
  }
  // console.log('params: ', params)

  const body = new URLSearchParams(params).toString()
  // console.log('body: ', body)

  let result: any = null

  // 尝试发起网络请求
  try {
    const response = await fetch(
      sensor.url,
      {
        method: 'post',
        body,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )

    result = await response.json()

    console.log(result)
  } catch (error) {
    console.error('reportSensor error: ', error)
  }
}

/**
 * 任务计划
 */
const plans = {
  minutely: async (): Promise<void> => {
    console.log(`${consolePrefix} minutely: `, getTimeString())

    if (sensor !== null && sensor.url?.length > 0) await reportSensor(sensor) // Dev only: 测试运行
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
  // 实例化传感器对象
  sensor = {
    id: process.env.SENSOR_ID ?? null,
    model: Number(process.env.SENSOR_MODEL ?? 11),
    gpio: Number(process.env.SENSOR_GPIO ?? 4),
    url: process.env.SENSOR_REPORT_URL ?? ''
  }

  try {
    // await reportSensor() // Dev only: 测试运行

    nodeCron.schedule('0 * * * * *', plans.minutely)
    nodeCron.schedule('0 0 * * * *', plans.hourly)
    nodeCron.schedule('0 0 0 * * *', plans.daily)
  } catch (error) {
    console.error('startAll error: ', error)
  }

  console.log('\x1b[32m%s\x1b[0m', '⏱ cron job initiated', sensor)
}

export default { startAll }
