const { SHT31 } = require('../lib')

// Parameters are unecessary when using a B+, A+, Zero, Zero W, Pi 2, or Pi 3
const sht31 = new SHT31()

sht31.readSensorData().then(data => {
  console.log(`The temperature is: ${Math.round(data.temperature)} degrees`)
  console.log(`The Humidity is: ${Math.round(data.humidity)}%`)

}).catch(console.log)
