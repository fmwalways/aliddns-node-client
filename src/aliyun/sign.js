const crypto = require('crypto');
const uuid = require('node-uuid');

const Ali_API_VERSION = '2015-01-09';
const Ali_SIGN_METHOD = 'HMAC-SHA1';
const Ali_SIGN_VERSION = '1.0';
const Ali_REQUEST_FORMAT = 'JSON';


const base_query = {
    Format: Ali_REQUEST_FORMAT,
    Version: Ali_API_VERSION,
    SignatureMethod: Ali_SIGN_METHOD,
    SignatureVersion: Ali_SIGN_VERSION
};


function sortQuery(query) {
    let _query = {};
    Object.keys(query).sort().forEach(function (key) {
        _query[key] = query[key];
    });
    return _query;
}


function query2string(query, encode = false) {
    let stringArray = [];
    for (let key of Object.keys(query)) {
        if (encode) {
            stringArray.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]));
        } else {
            stringArray.push(key + '=' + query[key]);
        }
    }
    return stringArray.join('&');
}

function query2sign(mothod = 'GET', queryString) {
    return mothod + '&' + encodeURIComponent('/') + '&' + encodeURIComponent(queryString);
}


function encryptSign(string, key) {
    let hmac = crypto.createHmac('sha1', key);
    hmac.update(string);
    return hmac.digest('base64');
}


function generateSignQuery(method = 'GET', query = {}, accessKeyId, accessKeySecret) {
    let date = new Date();
    let dynamicQuery = {
        AccessKeyId: accessKeyId,
        SignatureNonce: uuid.v4(),
        Timestamp: date.toISOString().replace(/\.\d{3}/, '')
    };
    let signQuery = Object.assign(query, dynamicQuery, base_query);
    signQuery = sortQuery(signQuery);
    let queryString = query2string(signQuery, true);
    let signString = query2sign(method, queryString);
    signQuery.Signature = encryptSign(signString, `${accessKeySecret}&`);
    return signQuery;
}


module.exports = {
    generateSignQuery
};