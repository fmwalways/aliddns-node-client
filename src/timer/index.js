const schedule = require('node-schedule');
const aliddns = require('../aliyun/aliddns');
const ip = require('../utilities/ip');
const SECOND_RULE = '* * * * * *';
const MINUTE_RULE = '0 * * * * *';



async function checkIpChange() {
    let realIp = ip.getRealIp();
    let serverIp = await aliddns.getDomainIp();
    if (!realIp || realIp === serverIp) {
        return;
    }
    await serverIp ? updateDomainIp(realIp) : addDomainIp(realIp);
}


async function addDomainIp(ip) {
    await aliddns.addDomainIp(ip);
}


async function updateDomainIp(ip) {
    await aliddns.updateDomainIp(ip);
}


function start(rule, callback) {
    return schedule.scheduleJob(rule, () => callback());
}



function init() {
    start(MINUTE_RULE, () => checkIpChange());
}

module.exports = {
    init
};