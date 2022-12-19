import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client'

let dbClient: InfluxDB
let writeClient: WriteApi

// 建立连接
const connect = (): InfluxDB | null => {
  try {
    dbClient = new InfluxDB({
      url: process.env.INFLUX_URL ?? 'http://localhost:8086/',
      token: process.env.INFLUX_TOKEN ?? ''
    })
  } catch (error) {
    console.error(error)
    return null
  }

  // console.log('InfluxDB engine initiated')
  return dbClient
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
    process.env.INFLUX_ORG ?? 'default',
    process.env.INFLUX_BUCKET ?? 'mydb',
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
  insertOne
}