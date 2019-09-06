
function checksum(data) {
    const polynomial = 0x31

    let crc = 0xFF
    let index = 0

    for (let k in data) {
        crc ^= data[index++]
        for (let i = 8; i > 0; --i) {
            crc = crc & 0x80 ? (crc << 1) ^ polynomial : crc << 1
            crc &= 0xFF
        }
    }
    
    return crc;
}

function delay(ms){
    return new Promise( (resolve) => {
        setTimeout(() => resolve(true), ms)
    })
}

function formatTemperature(rawTemp) {
    return ((rawTemp * 175) / 0xFFFF) - 45
}

function formatHumidity(rawHumidity) {
    return (rawHumidity * 100) / 0xFFFF
}

module.exports = { checksum, delay, formatTemperature, formatHumidity }
