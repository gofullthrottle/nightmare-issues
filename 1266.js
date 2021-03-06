const Nightmare = require('nightmare')
const Server = require('./server')
const express = require('express')

main().catch(console.error)

function html(body) {
  return `<!doctype><html><head><meta charset="UTF-8"> </head><body>${body}</body></html>`
}

async function main() {
  const app = express()
  const server = await Server(app)

  app.get('/', (req, res) => {
    res.send(html(``))
  })

  const nightmare = Nightmare({
    loadTimeout: 45 * 1000,
    waitTimeout: 5 * 1000,
    show: true
  })

  await nightmare.goto(server.url, '/')
  await nightmare.inject('js', './node_modules/moment/min/moment.min.js')

  const v = await nightmare.evaluate(() => moment().format())
  console.log(v)

  await nightmare.end()
  await server.close()
}
