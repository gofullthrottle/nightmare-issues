const Nightmare = require('nightmare')
const Xvfb = require('xvfb')

main().catch(console.error)

// main function
async function main() {
  console.time('xvfb')
  const close = await xvfb()
  console.timeEnd('xvfb')
  const nightmare = Nightmare()

  const [err, title] = await poss(run(nightmare))
  if (err) {
    // cleanup properly
    await nightmare.end()
    await close()
    throw err
  }

  console.log(title)

  // shut'er down
  await nightmare.end()
  await close()
}

// run nightmare
//
// put all your nightmare commands in here
async function run(nightmare) {
  console.time('goto')
  await nightmare.goto('https://google.com')
  console.timeEnd('goto')
  console.time('title')
  const title = await nightmare.title()
  console.timeEnd('title')
  return title
}

// xvvb wrapper
function xvfb(options) {
  var xvfb = new Xvfb(options)

  function close() {
    return new Promise((resolve, reject) => {
      xvfb.stop(err => (err ? reject(err) : resolve()))
    })
  }

  return new Promise((resolve, reject) => {
    xvfb.start(err => (err ? reject(err) : resolve(close)))
  })
}

// try/catch helper
async function poss(promise) {
  try {
    const result = await promise
    return [null, result]
  } catch (err) {
    return [err, null]
  }
}
