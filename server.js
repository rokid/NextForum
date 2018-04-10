'use strict'
const fs = require('fs')
const path = require('path')
const https = require('https')
const app = require('express')()
const targetHost = 'developer-forum.rokid.com'

app.use('/discourse/*', (req, res) => {
  var options = {
    host: targetHost,
    method: req.method,
    path: '/' + req.params[0],
    headers: {
      ...(req.headers),
      host: targetHost,
    }
  }
  const proxyRequest = https.request(options, (proxyResponse) => {
    for (let name in proxyResponse.headers) {
      res.setHeader(name, proxyResponse.headers[name])
    }
    res.status = proxyResponse.statusCode
    proxyResponse.pipe(res, { end: true })
  })
  req.pipe(proxyRequest, { end: true })
})

app.get('/*\.:ext', (req, res) => {
  const name = req.params[0]
  const ext = req.params.ext
  const file = fs.createReadStream(
    path.join(__dirname, `./dist/${name}.${ext}`))
  if (ext === 'js') {
    res.set('Content-Type', 'text/javascript');
  }
  file.on('error', (err) => {
    res.status(404)
    res.end(err.message)
  })
  file.pipe(res)
})

app.get('*', (req, res) => {
  const html = fs.createReadStream(
    path.join(__dirname, './dist/index.html'))
  res.type('html')
  html.pipe(res)
})

app.listen(process.env.PORT || 8080)