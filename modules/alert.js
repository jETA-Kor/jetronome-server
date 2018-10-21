const request = require('request');
const moment = require('moment');

const logger = require('./logger');

let fn = (name, msg) => {
    logger(msg);
};

/**
 * 알림 함수 설정
 * newFn(name, msg)
 * @param {function} newFn 신규 알림 함수
 */
const setAlertFn = (newFn) => {
    fn = newFn;
};
module.exports.setAlertFn = setAlertFn;

/**
 * 점검 실패 메시지 전송
 * @param {Object} options App 정보
 * @param {string} options.name App 이름
 * @param {string} options.ip App IP
 * @param {string} [options.testApi] App TEST API 경로
 * @param {Date} options.lastChecked 마지막 신호 수신 시각
 * @param {string} failType 점검 실패 유형 (test: Test API 접속 실패 / check: 장시간 신호 누락)
 */
const send = (options, failType) => {
    const lastCheckedStr = moment(options.lastChecked).format('YYYY-MM-DD HH:mm:ss'); // eslint-disable-line

    let msg = '';
    msg += '*○ ' + options.name + '*\n';
    if (failType === 'test') {
        msg += '- Test failure: [Test API](' + options.testApi + ')\n';
    } else {
        msg += '- Signal missed.\n';
    }
    msg += '- IP: ' + options.ip + '\n';
    msg += '- Last signal: ' + lastCheckedStr;

    fn(options.name, msg);
};
module.exports.send = send;
