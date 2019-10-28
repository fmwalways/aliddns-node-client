const schedule = require('node-schedule');
const aliddns = require('../aliyun/aliddns');
const ip = require('../utilities/ip');
const SECOND_RULE = '* * * * * *';
const MINUTE_RULE = '0 * * * * *';

let ali_config = {};



async function checkChange() {
    let realIp = ip.getRealIp();
    let domain = await aliddns.getDomain();
    if (!domain) {
        return;
    }
    let serverIp = domain && domain.Value;
    if (!serverIp) {
        await addDomain(realIp);
        return;
    }
    let ipChanged = realIp && realIp !== serverIp;
    let domainChanged = `${ali_config.child}.${ali_config.domain}` !== `${domain.RR}.${domain.DomainName}`;
    let changed = ipChanged || domainChanged;
    changed && await updateDomain(realIp);
}


async function addDomain(ip) {
    await aliddns.addDomain(ip);
}


async function updateDomain(ip) {
    await aliddns.updateDomain(ip);
}


function start(rule, callback) {
    return schedule.scheduleJob(rule, () => callback());
}


function init(config) {
    ali_config = config;
    start(MINUTE_RULE, () => checkChange());
}

module.exports = {
    init
};