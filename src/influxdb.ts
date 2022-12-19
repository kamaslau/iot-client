/**
 * InfluxDB
 * https://docs.influxdata.com/influxdb/cloud/api-guide/client-libraries/nodejs/
 */
import { InfluxDB, Point, WriteApi, QueryApi } from '@influxdata/influxdb-client'

let dbClient: InfluxDB
let writeClient: WriteApi
let queryClient: QueryApi

// 建立连接
const connect = (): void => {
  try {
    dbClient = new InfluxDB({
      url: process.env.INFLUX_URL ?? 'http://localhost:8086/',
      token: process.env.INFLUX_TOKEN ?? ''
    })
  } catch (error) {
    console.error(error)
  }

  // console.log('InfluxDB engine initiated')
}

// TODO 断开连接
const disconnect = async (): Promise<void> => {
  try {
    void writeClient.close().then(() => {
      console.log('InfluxDB writeApi CLOSED')
    })
  } catch (error) {
    console.error(error)
  }
}

const openWriteClient = () => {
  writeClient = dbClient.getWriteApi(
    process.env.INFLUX_ORG as string,
    process.env.INFLUX_BUCKET as string,
  )

  // 通用标签
  writeClient.useDefaultTags({
    sensor_model: process.env.SENSOR_MODEL as string,
    sensor_id: process.env.SENSOR_ID as string
  })
}

const openQueryClient = () => {
  queryClient = dbClient.getQueryApi(
    process.env.INFLUX_ORG as string
  )
}

/**
 * 插入数据点
 * 默认为浮点类型
 * 
 * @param measurement 
 * @param fieldValue 
 * @param fieldName 
 */
const insertOne = (measurement, fieldValue, fieldName = 'value') => {
  const point = new Point(measurement).floatField(fieldName, fieldValue)

  openWriteClient()
  writeClient.writePoint(point)
}

export default {
  connect,
  disconnect,
  openWriteClient,
  openQueryClient,
  insertOne
}