const router = require('express').Router(); // eslint-disable-line
const _ = require('underscore');
const moment = require('moment');

const serverStore = require('../modules/serverStore');

router.post('/setNameOfIp', (req, res) => {
    const ip = req.body.ip;
    const name = req.body.name;

    serverStore.setNameOfIp(ip, name);

    res.sendStatus(200);
});

module.exports = router;
