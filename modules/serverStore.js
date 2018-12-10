const _ = require('underscore');
const request = require('request');
const fs = require('fs');
const uuidv4 = require('uuid/v4');

const alert = require('./alert');
const logger = require('./logger');

const servers = {};

const nameOfIpFile = './db/nameOfIp.json';
let nameOfIp = {};
const writeNameOfIpFile = () => {
    try {
        fs.mkdirSync('./db');
    } catch (e) {
        if (e.code !== 'EEXIST') {
            logger(e, 'error');
        }
    };

    fs.writeFileSync(nameOfIpFile, JSON.stringify(nameOfIp));
};
try {
    nameOfIp = JSON.parse(fs.readFileSync(nameOfIpFile));
} catch (e) {
    logger('Name of ip file loading failed.');

    if (e.code === 'ENOENT') {
        writeNameOfIpFile();
        logger('Creating the new file.');
    }
}

/**
 * 신호 누락 시 실행할 함수 생성
 * @param {Object} info App 정보
 * @param {string} info.name App 이름
 * @param {string} info.ip App IP
 * @param {Number} info.interval 확인할 주기
 * @param {string} [info.testApi] App TEST API 경로
 * @param {Date} info.lastChecked 마지막 신호 수신 시각
 * @return {function} 신호 누락 시 실행할 함수
 */
const getAlert = (info) => {
    return setInterval(() => {
        alert.send(info, 'check');
    }, info.interval * 3);
};

/**
 * 신호 수신 처리
 * @param {Object} info App 정보
 * @param {string} info.name App 이름
 * @param {string} info.ip App IP
 * @param {Number} [info.interval] 확인할 주기
 * @param {string} [info.testApi] App TEST API 경로
 * @return {Object} 갱신된 신호
 */
const check = (info) => {
    // 기존 신호 호출
    const signal = servers[info.name] || info;

    // 기존 신호를 받은 적이 있다면
    if (signal.alert) {
        // 기존 신호 누락 처리 제거
        clearInterval(signal.alert);
    }

    // 보관 중인 데이터가 부족하다면
    if (!signal.description) {
        signal.ip = info.ip || signal.ip;
        signal.description = info.description || signal.description;
    }

    // App의 ID 지정
    signal.id = signal.id || uuidv4();

    // App의 IP가 변경되었다면
    if (signal.ip !== info.ip) {
        logger('IP Changed: ' + info.name);

        signal.ip = info.ip || signal.ip;
    }

    signal.alert = getAlert(signal); // 새 신호 누락 처리 함수 추가
    signal.lastChecked = new Date(); // 신호 수신 시간 저장
    signal.stat = info.stat; // 시스템 상태 갱신

    servers[info.name] = signal; // 수신된 신호 등록

    // Test API가 수신되었다면 접속 시도
    if (signal.testApi) {
        request(signal.testApi, (err, res) => {
            if (err || (res.statusCode !== 200)) {
                // 접속 오류 발생 시 즉시 메시지 전송
                alert.send(signal, 'test');
            }
        });
    }

    return signal;
};
module.exports.check = check;

/**
 * 점검할 App 제거
 * @param {Object} info App 정보
 * @param {string} info.name App 이름
 */
const remove = (info) => {
    const signal = servers[info.name];

    // 기존 신호 누락 처리 제거
    if (signal.alert) {
        clearInterval(signal.alert);
    }

    delete servers[info.name];
};
module.exports.remove = remove;

/**
 * 등록된 App 조회
 * @return {Object[]} 등록된 App 목록
 */
const status = () => {
    const results = [];
    _.each(servers, (el) => {
        const isOk = ((new Date() - el.lastChecked) < (el.interval * 3));

        results.push({
            id: el.id,
            name: el.name,
            ip: el.ip,
            description: el.description,
            testApi: el.testApi,
            lastChecked: el.lastChecked,
            isOk: isOk,
            stat: el.stat,
        });
    });

    return results;
};
module.exports.status = status;

/**
 * IP에 별칭 지정
 * @param {string} ip IP
 * @param {string} name 이름
 */
const setNameOfIp = (ip, name) => {
    nameOfIp[ip] = name;
    writeNameOfIpFile();
};
module.exports.setNameOfIp = setNameOfIp;

/**
 * IP의 별칭 호출
 * @param {string} ip IP
 * @return {string} 이름
 */
const getNameOfIp = (ip) => {
    return nameOfIp[ip];
};
module.exports.getNameOfIp = getNameOfIp;
