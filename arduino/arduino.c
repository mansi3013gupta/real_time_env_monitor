#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include <DHT.h>
#include <OneWire.h>
#include <DallasTemperature.h>

// Pins
#define DHTPIN 4           // GPIO for DHT22
#define DHTTYPE DHT22
#define ONE_WIRE_BUS 5     // GPIO for DS18B20

// Sensor objects
Adafruit_BME280 bme;       // BME280 I2C
DHT dht(DHTPIN, DHTTYPE);  // DHT22
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature ds18b20(&oneWire);

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Start sensors
  if (!bme.begin(0x76)) {
    Serial.println("Could not find BME280 sensor!");
  }

  dht.begin();
  ds18b20.begin();

  // Placeholder for camera setup
  Serial.println("Camera module setup placeholder...");
}

void loop() {
  Serial.println("----- Sensor Readings -----");

  // BME280 readings
  Serial.print("BME280 Temperature: ");
  Serial.print(bme.readTemperature());
  Serial.println(" °C");

  Serial.print("BME280 Humidity: ");
  Serial.print(bme.readHumidity());
  Serial.println(" %");

  Serial.print("BME280 Pressure: ");
  Serial.print(bme.readPressure() / 100.0F);
  Serial.println(" hPa");

  // DHT22 readings
  Serial.print("DHT22 Temperature: ");
  Serial.print(dht.readTemperature());
  Serial.println(" °C");

  Serial.print("DHT22 Humidity: ");
  Serial.print(dht.readHumidity());
  Serial.println(" %");

  // DS18B20 readings
  ds18b20.requestTemperatures();
  Serial.print("DS18B20 Temperature: ");
  Serial.print(ds18b20.getTempCByIndex(0));
  Serial.println(" °C");

  // Camera placeholder
  Serial.println("Camera: Cloud cover estimation logic to be added.");

  delay(5000);  // Delay between readings
}