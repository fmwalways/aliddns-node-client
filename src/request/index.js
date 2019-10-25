const request = require('request');
const logger = require('../utilities/logger');


function client(method, url, query, body) {
    let uri = {
        url: url,
        qs: query,
        method,
        json: true,
        headers: {'content-type': 'application/json'},
        body
    };
    return new Promise((resolve, reject) => {
        request(uri, function (error, response, body) {
            if (error) {
                reject(error);
                logger.error(error);
            } else {
                resolve(body);
                logger.info(body);
            }
        });
    });
}


module.exports = {
    client
};