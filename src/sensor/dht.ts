import sensor from 'node-dht-sensor'

interface sensorResponse {
  data?: {
    temp: number
    hum?: number
  }
  message?: string
	time: string // 可读日期时间字符串
  timestamp: number // UNIX时间戳
}

const read11 = (): any => {
	const result: sensorResponse = {
		time: new Date().toLocaleString(),
		timestamp: Date.now()
	}

	try {
		sensor.read(11, 4, (err, temperature, humidity) => {
			if (!err) {
				console.log(`temp: ${temperature}°C, humidity: ${humidity}%`);

				result.data = {
					temp: temperature, hum: humidity
				}
			} else {
				console.error("Failed to read sensor data: ", err);

				result.message = 'Failed to read sensor data'		
			}

			console.log(result)
			return result
		});
	} catch (err) {
		console.error("Failed to read sensor data: ", err);

		result.message = 'Failed to read sensor data'
	}
}

const read11Async = async () => {
	const result: sensorResponse = {
		time: new Date().toLocaleString(),
		timestamp: Date.now()
	}

	try {
		const res = await sensor.read(11, 4);
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
  read11, read11Async
}