import { InfluxDB, Point } from '@influxdata/influxdb-client'

const client = new InfluxDB({
  url: process.env.INFLUX_URL ?? 'http://localhost:8086/',
  token: process.env.INFLUX_TOKEN ?? ''
})

const writeClient = client.getWriteApi(
  process.env.INFLUX_ORG ?? 'default',
  process.env.INFLUX_BUCKET ?? 'mydb',
)

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

  writeClient.writePoint(point)
}

export default {
  insertOne
}