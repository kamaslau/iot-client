/**
 * 读取DHT传感器11/22数据
 * 需要运行在有GPIO接口的设备上
 */
import { promises as sensor } from 'node-dht-sensor'

interface sensorResponse {
  data?: {
    temp: number // 温度
    hum?: number // 湿度
  }
  message?: string // 错误信息
  time: string // 可读的日期时间字符串
  timestamp: number // UNIX时间戳
}

// 读取传感器数据
const read = async (model: number = 11, gpio: number = 4): Promise<any> => {
  const result: sensorResponse = {
    time: new Date().toLocaleString(),
    timestamp: Date.now()
  }

  // 尝试读取传感器数据
  try {
    const readings = await sensor.read(model, gpio)
    // console.log('readings: ', readings)

    result.data = {
      temp: readings.temperature.toFixed(2),
      hum: readings.humidity.toFixed(2)
    }
  } catch (error) {
    console.error('读取传感器数据失败: ', error)

    result.message = '读取传感器数据失败'
  }

  // console.log(result)
  return result
}

export default {
  read
}
