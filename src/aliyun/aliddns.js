const sign = require('./sign');
const logger = require('../utilities/logger');
const error = require('../error');
const request = require('../request');
const Ali_API = 'https://alidns.aliyuncs.com/';
const Ali_DOMAIN_TYPE = 'A';


let Ali_ACCESS_KEY_ID = '';
let Ali_ACCESS_KEY_SECRET = '';
let Ali_DOMAIN = '';
let Ali_DOMAIN_RR = '';


function findDomainRecords() {
    return requestAliyun('GET', {
        Action: 'DescribeDomainRecords',
        DomainName: Ali_DOMAIN,
        TypeKeyWord: Ali_DOMAIN_TYPE,
        RRKeyWord: Ali_DOMAIN_RR
    });
}


function addDomainRecord(ip) {
    return requestAliyun('GET', {
        Action: 'AddDomainRecord',
        DomainName: Ali_DOMAIN,
        TypeKeyWord: Ali_DOMAIN_TYPE,
        RR: Ali_DOMAIN_RR,
        Type: Ali_DOMAIN_TYPE,
        Value: ip
    });
}

function updateDomainRecord(recordId, ip) {
    return requestAliyun('GET', {
        Action: 'UpdateDomainRecord',
        DomainName: Ali_DOMAIN,
        RR: Ali_DOMAIN_RR,
        Type: Ali_DOMAIN_TYPE,
        RecordId: recordId,
        Value: ip
    });

}


function getDomain() {
    return findDomainRecords().then(result => {
        if (!result || !result.TotalCount) {
            return {};
        }
        let record = result.DomainRecords && result.DomainRecords.Record && result.DomainRecords.Record[0];
        if (!record) {
            return {};
        }
        return record;
    })
}


function getDomainIp() {
    return getDomain().then(result => {
        return result && result.Value;
    });
}


function getDomainId() {
    return getDomain().then(result => {
        return result && result.RecordId;
    });
}

function addDomainIp(ip) {
    return addDomainRecord(ip);
}


async function updateDomainIp(ip) {
    let recordId = await getDomainId();
    return updateDomainRecord(recordId, ip);
}


function requestAliyun(mothod, query) {
    return request.client(mothod, Ali_API, buildQuery(mothod, query));
}


function buildQuery(mothod, query) {
    return sign.generateSignQuery(
        mothod,
        query,
        Ali_ACCESS_KEY_ID, Ali_ACCESS_KEY_SECRET
    );
}


function init(config) {
    if (!config.accessKeyId) {
        logger.error(error.ALI_ACCESS_KEY_ID_EMPTY);
    }
    if (!config.accessKeySecret) {
        logger.error(error.ALI_ACCESS_KEY_SECRET_EMPTY);
    }
    if (!config.domain) {
        logger.error(error.ALI_DOMAIN_EMPTY);
    }
    if (!config.child) {
        logger.error(error.ALI_CHILD_DOMAIN_EMPTY);
    }

    Ali_ACCESS_KEY_ID = config.accessKeyId;
    Ali_ACCESS_KEY_SECRET = config.accessKeySecret;
    Ali_DOMAIN = config.domain;
    Ali_DOMAIN_RR = config.child;

}


module.exports = {
    init,
    getDomainIp,
    addDomainIp,
    updateDomainIp
};