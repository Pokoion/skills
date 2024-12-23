function hasContentString(str) {
    return str.trim().replace(/\r?\n/g, '') !== '';
}

function convertStringToArray(str) {
    return str.split('\r\n').map(item => item.trim()).filter(item => item !== '');
}

module.exports = {
    hasContentString,
    convertStringToArray
};