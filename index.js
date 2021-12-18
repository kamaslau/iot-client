const sensor = require("node-dht-sensor").promises;

async function exec() {
	try {
		const res = await sensor.read(22, 4);

		console.log(
			`temp: ${ res.temperature.toFixed(2) }C, humidity: ${ res.humidity.toFixed(2) }%`
		);
	} catch (err) {
		console.error("Failed to read sensor data:", err);
	}
}

exec();
