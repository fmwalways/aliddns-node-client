const process = require('./process');
const logger = require('./logger');
const error = require('../error');
const API_Domain = 'https://api.ipify.org/';


function getRealIp() {
    let ip = process.curl(API_Domain);
    if (ip) {
        logger.info(`get real ip success ${ip}`);
    } else {
        logger.error(error.IP_EMPTY_ERROR);
    }
    return ip;
}

module.exports = {
    getRealIp
};