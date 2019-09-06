# sht31-node-binding

A simple solution to read temperature and humidity from the SHT31 sensor.

This library relies on [this datasheet](http://www.mouser.com/ds/2/682/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital-1145192.pdf).

## Requirements
* A raspberry Pi
* I2C must be enabled
* SHT31 or SHT35 sensor [Adafruit](https://www.adafruit.com/product/2857)
* Node.js v6 or newer

## Usage

```javascript
const SHT31 = require('raspi-node-sht31');

const sht31 = new SHT31();

// Read the temp, after it resolves turn on the sensor heater and get the status, then turn off the heater after 10 seconds and show the status.
sht31.readSensorData().then(console.log, console.log).finally( () => {
  setTimeout(function(){
    sht31.getStatus().then(console.log, console.log);
  }, 3000)
  sht31.enableHeater(10000).then( () => sht31.getStatus() ).then(console.log, console.log);
});
```

```javascript
// Include the library
const SHT31 = require('raspi-node-sht31');
// Instantiate the class
const sht31 = new SHT31(); // Paramteres unecessary when using a B+, A+, Zero, Zero W, Pi 2, or Pi 3 (basically an orignal Pi uses 0 and must be set: new SHT31(0x44, 0))

// Read temperature and display in console in F with Relative humidity
sht31.readSensorData().then((data) => {
  // I love arrow notation functions inside of promises.

  // Temp in Fahrenheit -- If you get floating point rouding errors, multiply by ten before rouding, divide by 10 after.
  const temp = Math.round(data.temperature * 1.8 + 32);
  const humidity = Math.round(data.humidity);

  console.log(`The temperature is: ${temp} degress F\nThe Humidity is: ${humidity}%`); // Template strings are great.

}).catch(console.log);
```

## Credits

Original work by [@aphotix](https://github.com/aphotix). Initially a fork of [@alwint3r](https://github.com/alwint3r)'s well written [sht31-node](https://github.com/alwint3r/sht31-node) package.
