SHT31 Library using i2c-bus for Node.js
=======================================

Read temperature and humidity from the SHT31 sensor on the Raspberry Pi using i2c through the [i2c-bus](https://github.com/fivdi/i2c-bus) package.

## Credit where due
* Inspired by a python library https://github.com/jaques/sht21_python
* Initially a fork of Alwin Arrasyid's well written [sht31-node](https://github.com/alwint3r/sht31-node) package.
  I wanted to use i2c-bus instead of i2c. This code is very similar as a result, and is almost a drop in replacement.
* The [data sheet](http://www.mouser.com/ds/2/682/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital-1145192.pdf) made this possible

## Requirements
* A raspberry Pi
* Node v6 or newer (tested on 6.11.4 and 9.1.0)
* I²C must be enabled.
* SHT31 or SHT35 sensor [Adafruit](https://www.adafruit.com/product/2857)

## Dependancies
* [i2c-bus](https://github.com/fivdi/i2c-bus)
* [Bluebird](https://github.com/petkaantonov/bluebird/)

## Usage Example
```js
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

## A More Typical Usage
```js
// Include the library
const SHT31 = require('raspi-node-sht31');
// Instantiate the class
const sht31 = new SHT31(); // Paramteres unecessary when using a B+, A+, Zero, Zero W, Pi 2, or Pi 3 (basically an orignal Pi uses 0 and must be set: new SHT31(0x44, 0))

// Read temperature and display in console in F with Relative humidity
sht31.readSensorData().then((data) => {
  // I love arrow notation functions inside of promises.

  // Temp in Fahrenheit -- this is already rounded to one digit (accuracy is .2 degress, the other digits have no value) Multiplying it can cause some JS floating point weirdness, we just round it off here.
  const temp = Math.round(data.temperature * 1.8 + 32);
  const humidity = data.humidity;

  console.log(`The temperature is: ${temp} degress F\nThe Humidity is: ${humidity}%`); // Template strings are great.

}).catch(console.log);
```

## Notes
Issuing multiple commands before while one is unresolved will result in an error.
