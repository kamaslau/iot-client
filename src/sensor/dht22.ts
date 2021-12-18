import sensor from 'node-dht-sensor'

const read = async () => {
	const result = {
		time: Date.now()
	}

	try {
		const res = await sensor.read(22, 4);

		const temp = res.temperature.toFixed(2)
		const hum = res.humidity.toFixed(2)
		console.log(
			`temp: ${ temp }°C, humidity: ${ hum }%`
		);

		result.data = {
			temp, hum
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