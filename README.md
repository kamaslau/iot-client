# README.md

## Usage

Connect GPIO4 pin with sensor data output, together with 3.3V and GND pins.

```bash
# Mount overlay to GPIO 4, and persist it between reboots
sudo sh -c 'echo "dtoverlay=dht11,gpiopin=4" >> /boot/firmware/config.txt'
sudo reboot

# Init .env file, modify and use your own InfluxDB Cloud tokens
cp .env.sample .env

# Do reading
go mod tidy
go run ./...

# Build executable
go build ./src/main.go # Output file will be placed under ./tmp
```

## Run in background

```bash
cd ./Demos/golang-gpio && nohup ./tmp/main > output.log 2>&1 &
```

## Run on OS start

Use with systemd:

```bash
# Initiate systemd config file
sudo nano /etc/systemd/system/golang-gpio.service
```

```ini
[Unit]
Description=Golang-GPIO
After=network.target

[Service]
ExecStart=/home/pi/Demos/golang-gpio/tmp/main
Restart=always
User=pi
WorkingDirectory=/home/pi/Demos/golang-gpio

[Install]
WantedBy=multi-user.target
```

After that, enable service and start for the first time:

```bash
# Enable & start service
sudo systemctl enable golang-gpio.service
sudo systemctl start golang-gpio.service

# Check status
sudo systemctl status golang-gpio.service
```
