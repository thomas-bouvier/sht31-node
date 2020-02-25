# sht31-node

[![npm](https://img.shields.io/npm/v/sht31-node.svg)](https://www.npmjs.com/package/sht31-node)

A simple Node.js library to read temperature and humidity values from the SHT31/SHT35 sensors.

This library relies on [this datasheet](http://www.mouser.com/ds/2/682/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital-1145192.pdf).

## Requirements

* A Raspberry Pi
* I2C must be enabled
* SHT31 or SHT35 sensor [Adafruit](https://www.adafruit.com/product/2857)
* Node.js v7.6 or newer

## Installation

```bash
# Run this in your favourite terminal
npm i sht31-node
```

## Usage

Simply require and instantiate the package as a class. The `readSensorData` method returns a promise.

```javascript
const { SHT31 } = require('sht31-node')

// Parameters are unecessary when using a B+, A+, Zero, Zero W, Pi 2, or Pi 3
const sht31 = new SHT31()

sht31.readSensorData().then(data => {
    // Temperature in Fahrenheit
    const temperature = Math.round(data.temperature * 1.8 + 32)
    const humidity = Math.round(data.humidity)
    
  console.log(`The temperature is: ${temperature}°F`)
  console.log(`The Humidity is: ${humidity}%`)
}).catch(console.log)
```

## Credits

Original work by [@aphotix](https://github.com/aphotix). Initially a fork of [@alwint3r](https://github.com/alwint3r)'s well written [sht31-node](https://github.com/alwint3r/sht31-node) package.
