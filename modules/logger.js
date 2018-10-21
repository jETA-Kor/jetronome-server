const moment = require('moment');

/**
 * 로그 출력
 * @param {string} log 로그
 * @param {string} [type] 로그 유형 (log, error...)
 */
const logger = (log, type) => {
    const logType = type || 'log';
    let msg = '[Jetronome] [' + moment().format('YYYY-MM-DD HH:mm:ss') + '] ' + log;
    console[logType](msg);
};
module.exports = logger;
