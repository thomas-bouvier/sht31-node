const i2c = require('i2c-bus')

const constants = require('./constants')
const utilities = require('./utilities')

class SHT31 {
    constructor(address, device) {
        this.address = address || constants.DEFAULT_ADDR // Addr is 0x44 unless you intentionally change it.
        this.sensor = i2c.openSync(device || 1) // only the old pi uses 0
        this.sensorData = Buffer.alloc(6) // Returns 6 bytes [temp,temp,checksum,humidity,humidity,checksum]
        this.statusData = Buffer.alloc(3) // Returns 3 bytes [data,data,checksum]
    }

    async sendCommand(command) {
        // Commands are 16 bits, >> 8 will return the first 8 bits (left shift 8 bits), & 0xFF will get the last 8 bits.
        const cmd = Buffer.from([command >> 8, command & 0xFF])
        return this.sensor.i2cWriteSync(this.address, 2, cmd)
    }

    async readData(buffer) {
        return this.sensor.i2cReadSync(this.address, buffer.length, buffer)
    }

    async readSensorData() {
        return this.sendCommand(constants.CMD_READ_SENSOR)
            .then(() => utilities.delay(15))
            .then(() => this.readData(this.sensorData))
            .then(_ => {
                // i2c-bus requests a buffer be provided
                const data = [...this.sensorData]

                // check integrity
                const rawTemperature = {
                    data: data.slice(0, 2),
                    checksum: data[2]
                }
                const rawHumidity = {
                    data: data.slice(3, 5),
                    checksum: data[5]
                }

                return new Promise((resolve, reject) => {
                    if (rawTemperature.checksum != utilities.checksum(rawTemperature.data)){
                        reject('Temperature integrity check failed.')
                    }
            
                    if (rawHumidity.checksum != utilities.checksum(rawHumidity.data)){
                        reject('Humidity integrity check failed.')
                    }
            
                    const temperature = utilities.formatTemperature((rawTemperature.data[0] << 8) + rawTemperature.data[1])
                    const humidity = utilities.formatHumidity((rawHumidity.data[0] << 8) + rawHumidity.data[1])
            
                    resolve({
                        temperature,
                        humidity
                    })
                })
            })
    }

    async getStatus() {
        return this.sendCommand(constants.CMD_GET_STATUS)
            .then(() => this.readData(this.statusData))
            .then(_ => {
                const data = [...this.statusData]

                return new Promise((resolve, reject) => {
                    if (data[2] != utilities.checksum(data.slice(0,2))) {
                        reject('Temperature integrity check failed.')
                    }

                    // See documentation Page 13, Table 17.
                    resolve({
                        WriteStatus: !(data[1] & 0x01),
                        CommandStatus: !(data[1] & 0x02),
                        ResetDetected: !!(data[1] & 0x10),
                        TempTrackingAlert: !!(data[0] & 0x04),
                        RHTrackingAlert: !!(data[0] & 0x08),
                        HeaterEnabled: !!(data[0] & 0x20),
                        AlertPending: !!(data[0] & 0x80)
                    })
                })
            })
    }

    async reset() {
        return this.sendCommand(commands.CMD_RESET)
    }
}

module.exports = SHT31
