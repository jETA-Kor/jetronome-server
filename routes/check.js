const router = require('express').Router(); // eslint-disable-line

const serverStore = require('../modules/serverStore');
const logger = require('../modules/logger');

router.post('/', (req, res) => {
    const reqIp = (req.ip.substr(0, 7) == '::ffff:')
        ? req.ip.substr(7)
        : req.ip;

    const info = {
        name: req.body.name,
        ip: reqIp,
        description: req.body.description,
        testApi: req.body.testApi,
        interval: req.body.interval || 5000,
    };

    const init = req.query.init;
    const isValid = (info.name && info.ip && info.description);

    if (init && !isValid) {
        res.sendStatus(400);
        return true;
    }

    const signal = serverStore.check(info);

    if (signal.description) {
        res.sendStatus(200);
    } else {
        // 보관된 정보가 부족한 경우 (서버 재시작 등)
        res.sendStatus(205);
    }

    if (init) {
        logger('Initialized: ' + info.name);
    } else {
        logger('Signal: ' + info.name);
    }
});

router.delete('/', (req, res) => {
    const info = {
        name: req.body.name,
    };

    if (!info.name) {
        res.sendStatus(400);
        return true;
    }

    serverStore.remove(info);
    res.sendStatus(200);

    logger('Removed: ' + info.name);
});

module.exports = router;
