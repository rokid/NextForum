'use strict'
const fs = require('fs')
const url = require('url')
const path = require('path')
const https = require('https')
const cookie = require('cookieparser');
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
  console.log(options)
  const proxyRequest = https.request(options, (proxyResponse) => {
    for (let name in proxyResponse.headers) {
      res.setHeader(name, proxyResponse.headers[name])
    }
    console.log(proxyResponse.headers)
    res.status(proxyResponse.statusCode)
    proxyResponse.pipe(res, { end: true })
  })
  req.pipe(proxyRequest, { end: true })
})

app.get('/get_sso_login_url', (req, res) => {
  const rokidBackend = 'account.rokid.com'
  const forumBackend = 'https://developer-forum.rokid.com'
  const callbackUrl = req.query.callback_url
  const discourseSsoUrl = `${forumBackend}/session/sso?return_path=${callbackUrl}`
  https.get(discourseSsoUrl, (discourseResponse) => {
    const query = url.parse(discourseResponse.headers.location).hash.slice(1)
    const data = url.parse(query, true).query
    const setCookie = cookie.parse(req.query.set_cookie)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', 'application/json')

    const cookieStr = [
      `userName=${encodeURIComponent(setCookie.userName)}`,
      `headerIcon=${encodeURIComponent(setCookie.headerIcon)}`,
      `ROKID_ACCOUNT_SESSION=${setCookie['ROKID_ACCOUNT_SESSION']}`,
    ].join('; ')

    console.log('set request', setCookie, cookieStr)
    const rokidRequest = https.request({
      method: 'POST',
      host: rokidBackend,
      path: '/accounts/forumLogin.do',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieStr,
      },
    }, (accountResponse) => {
      console.log(accountResponse.statusCode);
      res.writeHead(accountResponse.statusCode)
      accountResponse.pipe(res)
    })
    const sent = JSON.stringify(data)
    rokidRequest.end(sent)
  })
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
  const filePath = path.join(__dirname, './dist/index.html')
  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.writeHead(404)
      res.end('not found')
      return
    }
    res.type('html')
    fs.createReadStream(filePath).pipe(res)
  })
})

app.listen(process.env.PORT || 8080)
