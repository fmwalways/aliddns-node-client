const execSync = require('child_process').execSync;
const exec = require('child_process').exec;


function curl(address) {
    return runCommand(`curl ${address}`);
}

function runCommand(command, sync = true, encode = 'utf-8') {
    let options = {stdio: 'pipe'};
    return sync ? execSync(command, options).toString(encode) : exec(command, options);
}


module.exports = {
    runCommand,
    curl
};