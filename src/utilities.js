'use strict';

const Promise = require('bluebird');
const i2c = require('i2c-bus');

function checksum(data){ // expects iterable (should be a buffer)
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
  return Math.round( (((rawTemp * 175) / 0xFFFF) - 45) * 10 ) / 10; // Accurate +/- .2 degress
}

function formatHumidity(rawHumidity){
  return Math.round( (rawHumidity * 100) / 0xFFFF);
}

module.exports = { checksum, i2cBusPromiseWrapper, delay, formatTemperature, formatHumidity };
