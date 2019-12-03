# sht31-node

A simple solution to read temperature and humidity from the SHT31 sensor.

This library relies on [this datasheet](http://www.mouser.com/ds/2/682/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital-1145192.pdf).

## Requirements
* A Raspberry Pi
* I2C must be enabled
* SHT31 or SHT35 sensor [Adafruit](https://www.adafruit.com/product/2857)
* Node.js v7.6 or newer

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
