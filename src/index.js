const config = require('../config');
const aliddns = require('./aliyun/aliddns');
const timer = require('./timer');
const logger = require('./utilities/logger');


aliddns.init(config);
timer.init(config);
logger.info('client is started');



