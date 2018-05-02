// Include the library
const SHT31 = require('../src/index.js'); // this should be const SHT31 = require('raspi-node-sht31'); when installed using npm
// Instantiate the class
const sht31 = new SHT31(); // Paramteres unecessary when using a B+, A+, Zero, Zero W, Pi 2, or Pi 3 (basically an orignal Pi uses 0 and must be set: new SHT31(0x44, 0))

// Read temperature and display in console in F with Relative humidity
sht31.readSensorData().then((data) => {
  // I love arrow notation functions inside of promises.
  const temp = Math.round(data.temperature * 1.8 + 32); // Temp in Fahrenheit
  const humidity = Math.round(data.humidity);

  console.log(`The temperature is: ${temp} degress F\nThe Humidity is: ${humidity}%`); // Template strings are great.

}).catch(console.log);
