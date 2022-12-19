/**
 * 计划任务
 *
 * https://www.npmjs.com/package/node-cron
 */
import { getTimeString } from './utils'
import { dht } from './sensor'
import nodeCron from 'node-cron'
import fetch from 'node-fetch'
import { InfluxDB, Point } from '@influxdata/influxdb-client'
import { URLSearchParams } from 'node:url'

// 控制台输出前缀
const consolePrefix = '⏱ cron job: '

// 传感器类型定义
interface Sensor {
  id: string | null // 传感器ID
  model: number // DHT传感器型号（11/22）
  gpio: number // GPIO接口号
  url: string // 上报URL
}

// 传感器
let sensor: Sensor | null

/**
 * 读取并上报传感器数据
 * 
 * TODO 若上报失败，存储为本地数据以备补录；后续补录完成后，应清理相应本地数据。
 * 
 * @param sensor 传感器实例
 * @returns { void }
 */
const reportSensor = async (sensor: Sensor): Promise<void> => {
  // console.log('reportSensor: ', process.env, sensor)

  // 读取数据
  const readings = await dht.read(sensor.model, sensor.gpio)
  if (readings.message?.length > 0) return

  let shouldRetry: boolean = false // 是否需进行重试/数据补录

  // 上报数据
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
    // console.log(result)

    // TODO 可能存在需根据上报结果的相应参数，安排数据补录的业务场景
    const token = process.env.INFLUXDB_TOKEN ?? ''
    const url = process.env.INFLUXDB_URL ?? ''
    const client = new InfluxDB({url, token})
  } catch (error) {
    // console.error('reportSensor error: ', error)

    shouldRetry = true
  }

  shouldRetry && retryReport(readings)
}

/**
 * TODO 计划数据补录
 * 
 * @param readings 传感器读数
 */
const retryReport = (readings: any): void => {
  console.log('retryReport: ', readings)
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
