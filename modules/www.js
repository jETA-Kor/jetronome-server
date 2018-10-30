const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');

module.exports.start = (options) => {
    const port = options.port || 7828;

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        limit: '150mb',
        extended: true,
    }));

    app.set('views', path.join(__dirname, '..', 'views'));
    app.set('view engine', 'ejs');

    app.use('/list', require('../routes/list'));
    app.use('/check', require('../routes/check'));
    app.use('/api', require('../routes/api'));

    app.use(express.static(path.join(__dirname, '..', 'public')));

    http.createServer(app).listen(port, () => {
        console.log('HTTP server listening on port ' + port);
    });
};
