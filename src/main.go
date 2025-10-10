package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"time"

	"app/src/drivers"

	"github.com/joho/godotenv"
)

// loadEnv Load env variable(s) from .env file
func loadEnv() {
	if err := godotenv.Load(".env"); err != nil {
		log.Fatalf("Fail loading .env: %s", err)
	}
}

// Initiate Service Components first, fail fast so we can break early
func initServices() {
	drivers.ConnectTS() // Warning on failure
}

func readIIO(path string) float64 {
	b, err := os.ReadFile(path)
	if err != nil || len(b) == 0 {
		return -999
	}
	v, _ := strconv.Atoi(string(b[:len(b)-1]))
	return float64(v) / 1000.0
}

func main() {
	loadEnv()
	initServices()

	const (
		tempPath = "/sys/bus/iio/devices/iio:device0/in_temp_input"
		humPath  = "/sys/bus/iio/devices/iio:device0/in_humidityrelative_input"
	)
	for {
		t := readIIO(tempPath)
		h := readIIO(humPath)
		if t == -999 || h == -999 {
			fmt.Println("driver is not ready, retry...")
			time.Sleep(1 * time.Second)
			continue
		}
		fmt.Printf("T = %.2f °C, RH = %.1f %%\n", t, h)

		if err := drivers.TSWrite("dht11", map[string]string{"type": "dht11"}, map[string]any{"temperature": t, "humidity": h}); err != nil {
			fmt.Println("Failed to write to TS:", err)
		}
		time.Sleep(60 * time.Second)
	}
}
