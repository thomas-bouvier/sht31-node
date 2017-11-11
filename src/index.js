'use strict';

const Promise = require('bluebird');
const commands = require('./commands');
const utilities = require('./utilities');

class SHT31 {
  constructor(address, device){
    this.address = address || commands.DEFAULT_ADDR; // Addr is 0x44 unless you intentionally change it.
    this.sensor = utilities.i2cBusPromiseWrapper(device || 1); // only the old pi uses 0
    this.sensorData = Buffer.alloc(6); // Returns 6 bytes [temp,temp,checksum,humidity,humidity,checksum]
    this.statusData = Buffer.alloc(3); // Returns 3 bytes [data,data,checksum]
  }

  // the command is i2cWrite, the Async is added by bulk promisifying using Bluebird promisifyAll.
  sendCommand(command){
    const cmd = Buffer.from([command >> 8, command & 0xFF]); // Commands are 16 bits, >> 8 will return the first 8 bits (left shift 8 bits), & 0xFF will get the last 8 bits.
    return this.sensor.i2cWriteAsync(this.address, 2, cmd);
  }

  readData(buffer){
    return this.sensor.i2cReadAsync(this.address, buffer.length, buffer);
  }

  reset(){
    return this.sendCommand(commands.CMD_RESET);
  }

  readSensorData(){
    return this.sendCommand(commands.CMD_READ_SENSOR)
      .then( () => utilities.delay(15) )
      .then( () => this.readData(this.sensorData) )
      .then( (bytesRead) => {
        // i2c-bus requests a buffer be provided, bulk promisifying means the sensor data isn't returned with the promise.
        const data = [...this.sensorData];
        // check integrity
        const rawTemp = { data: data.slice(0,2), checksum: data[2] };
        const rawHumid= { data: data.slice(3, 5), checksum: data[5] };

        if(rawTemp.checksum != utilities.checksum(rawTemp.data)){
          return Promise.reject(new Error('Temperature Integrity Check Failed.'));
        }

        if(rawHumid.checksum != utilities.checksum(rawHumid.data)){
          return Promise.reject(new Error('Humidity Integrity Check Failed.'));
        }

        const temperature = utilities.formatTemperature((rawTemp.data[0] << 8) + rawTemp.data[1]);
        const humidity = utilities.formatHumidity((rawHumid.data[0] << 8) + rawHumid.data[1]);

        return { temperature, humidity };

      });
  }

  getStatus(){
    return this.sendCommand(commands.CMD_GET_STATUS)
      .then( () => this.readData(this.statusData) )
      .then( (bytesRead) => {
        const data = [...this.statusData];

        if( data[2] != utilities.checksum(data.slice(0,2)) ){
          return Promise.reject(new Error('Temperature Integrity Check Failed.'));
        }

        // See documentation Page 13, Table 17.
        return {
          WriteStatus: !(data[1] & 0x01),
          CommandStatus: !(data[1] & 0x02),
          ResetDetected: !!(data[1] & 0x10),
          TempTrackingAlert: !!(data[0] & 0x04),
          RHTrackingAlert: !!(data[0] & 0x08),
          HeaterEnabled: !!(data[0] & 0x20),
          AlertPending: !!(data[0] & 0x80)
        };

    });
  }

  /* The heater is intended for plausibility testing only. It should increase
     the temperature by a few degress. (RH will be impacted as well.) */
  enableHeater(duration){
    const cmd = this.sendCommand(commands.CMD_HEATER_ON);
    if(duration){
      return cmd
        .then( () => utilities.delay(duration) )
        .then( () => this.disableHeater() );
    } else {
      return cmd;
    }
  }

  disableHeater(){
    return this.sendCommand(commands.CMD_HEATER_OFF);
  }

}

module.exports = SHT31;
