const getPort = require('get-server-port')
const concat = require('concat-stream')
const stream = require('stream')
const test = require('tape')
const http = require('http')
const url = require('url')

const nodeMiddlewareLog = require('./')

test('should assert input types', function (t) {
  t.plan(3)
  t.throws(nodeMiddlewareLog.bind(null), 'nothing')
  t.throws(nodeMiddlewareLog.bind(null, 'asdf', /is stream/), 'stream')
  t.throws(nodeMiddlewareLog.bind(null, 'asdf', 'asdf', /is object/), 'opts')
})

test('should provide logging middleware', function (t) {
  t.plan(5)
  var count = 0
  const ts = new stream.PassThrough()
  ts.on('data', function (data) {
    const obj = JSON.parse(data)
    if (count++ === 0) {
      t.equal(obj.message, 'request', 'message')
      t.equal(obj.url, '/', 'url')
    } else {
      t.equal(obj.message, 'response', 'messsage')
      t.equal(typeof obj.contentLength, 'number', 'contentLength')
    }
  })

  const log = nodeMiddlewareLog(ts)

  const server = http.createServer(function (req, res) {
    log(req, res, function (err) {
      t.ifError(err, 'no err')
      res.end()
    })
  }).listen()

  const port = getPort(server)
  http.get('http://localhost:' + port, function () {
    server.close()
  })
})

test('should allow configuration', function (t) {
  t.plan(3)
  var count = 0
  const ts = new stream.PassThrough()
  ts.on('data', function (data) {
    const obj = JSON.parse(data)
    if (count++ === 0) {
      t.equal(typeof obj.request, 'object')
      t.equal(typeof obj.request.body, 'string')
    }
  })

  const log = nodeMiddlewareLog({ requestBody: true, responseBody: true }, ts)

  const server = http.createServer(function (req, res) {
    req.pipe(concat(function (body) {
      req.body = String(body)
      log(req, res, function (err) {
        t.ifError(err, 'no err')
        res.end()
      })
    }))
  }).listen()

  const port = getPort(server)
  const route = url.parse('http://localhost:' + port)
  route.method = 'PUT'
  http.request(route, function () {
    server.close()
  }).end('hello world')
})
