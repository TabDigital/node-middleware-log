# node-middleware-log [![stability][0]][1]
[![npm version][2]][3] [![build status][4]][5] [![test coverage][6]][7]
[![downloads][8]][9] [![js-standard-style][10]][11]

Ndjson logging middleware.

## Installation
```sh
$ npm install node-middleware-log
```

## Usage
```js
const logMiddleware = require('middleware-log')
const http = require('http')

const logOpts = { requestBody: true }
const log = httpLogger(logOpts, process.stdout)

http.createServer(function (req, res) {
  log(req, res, function (err, res) {
    // logic
  })
}).listen()
```

__express + bole__
```js
const logMiddleware = require('middleware-log')
const boleStream = require('bole-stream')
const express = require('express')
const bole = require('bole')

bole.output({ stream: process.stdout })

const app = express()
app.use(logMiddleware(boleStream({ level: 'info' })))
app.listen()
```

__restify + bunyan__
```js
const logMiddleware = require('middleware-log')
const bunyanStream = require('bunyan-stream')
const restify = require('restify')
const bunyan = require('bunyan')

const logger = bunyan.createLogger({ name: 'myApp' })

const server = restify.createServer()
server.use(logMiddleware(bunyanStream({ level: 'info' }, logger)))
```

## API
### log = logMiddleware(opts, outStream)
Create logging middleware. Options can contain the following values:
- __requestBody:__ log the requests body. Requires `req.body` to exist, which
  is often patched on by frameworks such as `express` or `restify`.

### log(req, res, cb(err, res))
Log a request and response, calls a callback after it's finished initializing.

## Limitations
In order to be compatible with popular frameworks such as `express` and
`restify`,  `middleware-log` has had to make tradeoffs. To get properties such
as response size, Node's native properties are being patched on every request.
Also, to log the request size this package also relies on a non-standard
`req.body` value to be present. If you'd like to roll your own `middleware-log`
with different tradeoffs take a look at `size-stream` and `http-ndjson`.

## License
[MIT](https://tldrlegal.com/license/mit-license)

[0]: https://img.shields.io/badge/stability-experimental-orange.svg?style=flat-square
[1]: https://nodejs.org/api/documentation.html#documentation_stability_index
[2]: https://img.shields.io/npm/v/middleware-log.svg?style=flat-square
[3]: https://npmjs.org/package/middleware-log
[4]: https://img.shields.io/travis/TabDigital/node-middleware-log/master.svg?style=flat-square
[5]: https://travis-ci.org/TabDigital/node-middleware-log
[6]: https://img.shields.io/codecov/c/github/TabDigital/node-middleware-log/master.svg?style=flat-square
[7]: https://codecov.io/github/TabDigital/node-middleware-log
[8]: http://img.shields.io/npm/dm/node-middleware-log.svg?style=flat-square
[9]: https://npmjs.org/package/node-middleware-log
[10]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[11]: https://github.com/feross/standard
