const sign = require('./sign');
const logger = require('../utilities/logger');
const error = require('../error');
const request = require('../request');
const Ali_API = 'https://alidns.aliyuncs.com/';
const Ali_DOMAIN_TYPE = 'A';


let Ali_ACCESS_KEY_ID = '';
let Ali_ACCESS_KEY_SECRET = '';


function findDomainRecords(domain) {
    let {DomainName, RR} = parseDomain(domain);
    return requestAliyun('GET', {
        Action: 'DescribeDomainRecords',
        DomainName,
        TypeKeyWord: Ali_DOMAIN_TYPE,
        RRKeyWord: RR
    });
}


function addDomainRecord(ip, domain) {
    let {DomainName, RR} = parseDomain(domain);
    return requestAliyun('GET', {
        Action: 'AddDomainRecord',
        DomainName,
        TypeKeyWord: Ali_DOMAIN_TYPE,
        RR,
        Type: Ali_DOMAIN_TYPE,
        Value: ip
    });
}

function updateDomainRecord(recordId, ip, domain) {
    let {DomainName, RR} = parseDomain(domain);
    return requestAliyun('GET', {
        Action: 'UpdateDomainRecord',
        DomainName,
        RR,
        Type: Ali_DOMAIN_TYPE,
        RecordId: recordId,
        Value: ip
    });

}


function getDomainRecord(domain) {
    return findDomainRecords(domain).then(result => {
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


function getDomainIp(domain) {
    return getDomainRecord(domain).then(result => {
        return result && result.Value;
    });
}


function getDomainId(domain) {
    return getDomainRecord(domain).then(result => {
        return result && result.RecordId;
    });
}

function addDomain(ip, domain) {
    return addDomainRecord(ip, domain);
}


async function updateDomain(ip, domain) {
    let recordId = await getDomainId(domain);
    return updateDomainRecord(recordId, ip, domain);
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

    Ali_ACCESS_KEY_ID = config.accessKeyId;
    Ali_ACCESS_KEY_SECRET = config.accessKeySecret;

}


function parseDomain(domain) {
    let results = domain.split('.');
    if (results.length < 3) {
        return {RR: '@', DomainName: domain};
    }
    let RR = results.splice(0, results.length - 2).join('.');
    let DomainName = results.join('.');
    return {RR, DomainName}
}


module.exports = {
    init,
    getDomainIp,
    addDomain,
    updateDomain,
    getDomainRecord
};
