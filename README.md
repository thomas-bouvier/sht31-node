SHT31 Library using i2c-bus for Node.js
=======================================

Read temperature and humidity from the SHT31 sensor on the Raspberry Pi using i2c through the [i2c-bus](https://github.com/fivdi/i2c-bus) package.

## Credit where due
This was inspired by a python library https://github.com/jaques/sht21_python
This started as a fork of Alwin Arrasyid's well written [sht31-node](https://github.com/alwint3r/sht31-node) package, but another package used i2c-bus. I decided to adapt sht31-node to use i2c-bus instead. I learned a lot on the way and tried to make the code easier to understand for a less experienced programmer.
The [data sheet](http://www.mouser.com/ds/2/682/Sensirion_Humidity_Sensors_SHT3x_Datasheet_digital-1145192.pdf) made this possible

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

## Notes
Issuing a readSensorData command and then another command before readSensorData has resolved will result in an error.
