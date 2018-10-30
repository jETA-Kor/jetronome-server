const router = require('express').Router(); // eslint-disable-line
const _ = require('underscore');
const moment = require('moment');

const serverStore = require('../modules/serverStore');

router.get('/', (req, res) => {
    const serverStoreData = serverStore.status();

    // 요청한 데이터 유형이 JSON인 경우
    if (req.query.type === 'json') {
        res.send(serverStoreData);
        return true;
    }

    const apps = _.groupBy(serverStoreData, (el) => {
        return el.ip;
    });

    res.render('list', {
        apps: apps,
        getTimeStr: (time) => {
            return moment(time).format('YYYY-MM-DD HH:mm:ss');
        },
        getNameOfIp: serverStore.getNameOfIp,
    });
});

module.exports = router;
