const resSize = require('emit-response-size')
const httpNdjson = require('http-ndjson')
const isStream = require('is-stream')
const assert = require('assert')

module.exports = nodeMiddlewareLog

// Ndjson logging middleware
// (obj?, wstream) -> (obj, obj, fn(err, obj?)) -> null
function nodeMiddlewareLog (opts, outStream) {
  if (!outStream) {
    outStream = opts
    opts = {}
  }

  assert.equal(typeof opts, 'object', 'is object')
  assert.ok(isStream(outStream), 'is stream')

  return function (req, res, done) {
    const httpOpts = {}
    if (opts.requestBody) httpOpts.req = { request: { body: req.body } }
    const httpLogger = httpNdjson(req, res, httpOpts)
    httpLogger.pipe(outStream, { end: false })

    resSize(res)
    res.on('size', function (size) {
      httpLogger.setContentLength(size)
    })

    return done()
  }
}
