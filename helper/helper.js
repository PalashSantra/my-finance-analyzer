const convertToBase64 = (string) => {
    return Buffer.from(string).toString('base64')
}
const convertFromBase64 = (string) => {
    return Buffer.from(string,'base64').toString('utf8')
}

module.exports = {convertToBase64,convertFromBase64}