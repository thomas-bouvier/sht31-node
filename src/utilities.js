'use strict';

const Promise = require('bluebird');
const i2c = require('i2c-bus');

function checksum(data){ // expects iterable
  const length = data.length;
  const polynomial = 0x31;

  let crc = 0xFF;
  let index = 0;

  for(let k in data){
    crc ^= data[index++];
    for(let i = 8; i > 0; --i){
      crc = crc & 0x80 ? (crc << 1) ^ polynomial : crc << 1;
      crc &= 0xFF;
    }
  }
  return crc;
}

function i2cBusPromiseWrapper(device){
  const instance = i2c.openSync(device);
  return Promise.promisifyAll(instance);
}

function delay(ms){
  return new Promise( (resolve) => {
    setTimeout( () => resolve(true), ms );
  } );
}

function formatTemperature(rawTemp){
  return ((rawTemp * 175) / 0xFFFF) - 45;
}

function formatHumidity(rawHumidity){
  return (rawHumidity * 100) / 0xFFFF;
}

module.exports = { checksum, i2cBusPromiseWrapper, delay, formatTemperature, formatHumidity };
