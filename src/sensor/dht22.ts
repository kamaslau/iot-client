import {promises as sensor} from 'node-dht-sensor'

interface sensorResponse {
  data?: {
    temp: number
    hum?: number
  }
  message?: string
	time: string // 可读日期时间字符串
  timestamp: number // UNIX时间戳
}

const read = async () => {
	const result: sensorResponse = {
		time: Date.toString(),
		timestamp: Date.now()
	}

	try {
		const res = await sensor.read(22, 4);
    console.log('sensor.read res: ', res)

		if (res.isValid) {
			const temp = res.temperature.toFixed(2)
			const hum = res.humidity.toFixed(2)
			console.log(
				`temp: ${ temp }°C, humidity: ${ hum }%`
			);
	
			result.data = {
				temp, hum
			}
		}

	} catch (err) {
		console.error("Failed to read sensor data: ", err);

		result.message = 'Failed to read sensor data'
	}

	console.log(result)
	return result
}

export default {
  read
}