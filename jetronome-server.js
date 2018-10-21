const www = require('./modules/www');
const alert = require('./modules/alert');

/**
 * 서버 시작
 * @param {Object} options 옵션
 * @param {function} [options.alertFn] 오류 감지 시 실행할 함수
 * @param {Number} [options.port] 실행할 포트
 */
const driver = (options) => {
    if (options.alertFn) {
        alert.setAlertFn(options.alertFn);
    }

    www.start({
        port: options.port,
    });
};

module.exports = driver;
