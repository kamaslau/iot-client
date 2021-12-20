import { promises as sensor} from 'node-dht-sensor'

interface sensorResponse {
  data?: {
    temp: number
    hum?: number
  }
  message?: string
	time: string // 可读日期时间字符串
  timestamp: number // UNIX时间戳
}

const read = async (model = 11, gpio = 4): Promise<any> => {
	const result: sensorResponse = {
		time: new Date().toLocaleString(),
		timestamp: Date.now()
	}

	try {
		const res = await sensor.read(model, gpio);
    console.log('read res: ', res)

		result.data = {
			temp: res.temperature.toFixed(2),
			hum: res.humidity.toFixed(2)
		}
	} catch (err) {
		console.error("Failed to read sensor data: ", err);

		result.message = 'Failed to read sensor data'
	}

	// console.log(result)
	return result
}

export default {
  read
}