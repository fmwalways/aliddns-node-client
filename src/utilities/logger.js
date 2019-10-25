const TAG = require('../const').LOG_TAG;

function info(message) {
    return console.info(splice(message));
}

function error(message) {
    return console.error(splice(message));
}

function log(message) {
    return console.log(splice(message));
}

function splice(message) {
    if (!message) {
        message = '';
    }
    if (typeof message === 'object') {
        message = JSON.stringify(message);
    }
    return `${TAG} ${message}`;
}

module.exports = {
    info,
    error,
    log
};







