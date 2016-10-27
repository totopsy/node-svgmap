#!/usr/local/bin/node

// Deps and imports
const Fs = require('fs')
const Path = require('path')
const R = require('ramda')

// Generic helpers
const log = x => (console.log(x), x)
const nlog = (...x) => (x.forEach(log), x[0])
const rlog = err => log(err.message)
const genericCallback = (err, res) => log(err ? err.message : res)

// file helpers

// Constants
const STANDALONE = !module.parent // Falsy if imported
const EXT = '.svg'

if (STANDALONE) {
  log('Detected being called as standalone script.')
}
const toTest = `${Path.resolve(process.argv[2])}${Path.sep}`

nlog(
  `Running in ${Path.resolve('.')}`,
  `Mapping ${Path.resolve(process.argv[2])} for ${EXT} files`
)

const doDir = dirPath => {
  Fs.readdir(dirPath,
    (err, res) => {
      if (err) {
        log(err);
        return err
      } else if (res.length) {
        // log(`${res} will now be checked`)
        res.forEach(fileName => checkFile(Path.resolve(Path.join(dirPath, fileName))));
      }
    })
}

const doMatch = filePath => {
  log(`Hit : ${
    Path.basename(filePath)
  } in ${
    `${Path.dirname(filePath)}`.replace(Path.dirname(toTest) + Path.sep, '')
  }`)
  // Do the logic bitch !
  
}

const checkFile = filePath => {
  Fs.stat(filePath,
    (err, res) => {
      if (err){
        log(err.message)
        return err
      }
      else if (res.isFile() && Path.extname(filePath) === EXT) {
        doMatch(filePath)
      } else if (res.isDirectory()) {
        // log(`${filePath} is a directory`)
        doDir(filePath)
      } else {
        // log(`File ${filePath}`, res)
      }
    })
}

checkFile(toTest)
