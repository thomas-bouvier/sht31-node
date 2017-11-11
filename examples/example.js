const SHT31 = require('../src/index.js');

const sht31 = new SHT31();

sht31.readSensorData().then(console.log, console.log).finally( () => {
  setTimeout(function(){
    sht31.getStatus().then(console.log, console.log);
  }, 3000)
  sht31.enableHeater(10000).then( () => sht31.getStatus() ).then(console.log, console.log);
});
