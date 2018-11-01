# jetronome-server
[![npm version](https://badge.fury.io/js/jetronome-server.svg)](https://badge.fury.io/js/jetronome-server)

Jetronome Server is the simplest server to check application status in one place.
- License: MIT License
- Documentation: [https://jetalog.net/78](https://jetalog.net/78)
## Features
- Periodic signal validation
- Grouped application list
- Alert when loss a signal or test failed

## Install
```
$ npm i --save jetronome-server
```

## Usage
#### Initialize
```
require('jetronome-server')({
    alertFn: (name, msg) => { // The function to be executed when an alarm occurs.
        console.error(name);
        console.error(msg);
    },
    port: 7828, // (Optional) Web server port. Default port is 7828(s.t.a.t)
});
```

#### List
You can get the applications list in two types.
- HTML: `/list` (ex [http://localhost:7828/list](http://localhost:7828/list))
- JSON: `/list?type=json` (ex [http://localhost:7828/list?type=json](http://localhost:7828/list?type=json))

## Client App
To use this server, you have to use Jetronome Client in pairs.
- GitHub: https://github.com/jetronome/jetronome-client
- npm: https://npmjs.com/jetronome-client
- Documentation: https://jetalog.net/79
