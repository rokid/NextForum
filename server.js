'use strict'
const fs = require('fs')
const path = require('path')
const app = require('express')()

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