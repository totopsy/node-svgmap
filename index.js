#!/usr/local/bin/node

// return value
let toJSON = {}

// Deps and imports
const Fs = require('fs')
const Path = require('path')

// global counters
let DIRS = 0
let FILES = 0

// Generic helpers
const log = x => (console.log(x), x)
const nlog = (...x) => (x.forEach(log), x[0])
const rlog = err => log(err.message)
const genericCallback = (err, res) => log(err ? err.message : res)

// file helpers
const getRelPath = path => path.replace(Path.dirname(toTest) + Path.sep, '')

// Constants
const STANDALONE = !module.parent // Falsy if imported
const EXT = '.svg'
const OUT = `${EXT}.json`
const toTest = `${Path.resolve(process.argv[2])}${Path.sep}`

// Object helper
const assocPath = (target, path, file) => {
  FILES ++
  let objPath = Path.dirname(getRelPath(path)).split(Path.sep)
  let ref = target
  objPath.forEach(key => {
    if (!ref[key]) {
      DIRS ++
      ref[key] = {}
    }
    ref = ref[key]
  })
  ref[Path.basename(file, EXT)] = Fs.readFileSync(path, 'UTF-8')
}

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
        res.forEach(fileName => checkFile(Path.resolve(Path.join(dirPath, fileName))));
      }
    })
}

const onMatch = filePath => {
  assocPath(toJSON, filePath, Path.basename(filePath))
}

const checkFile = filePath => {
  Fs.stat(filePath,
    (err, res) => {
      if (err){
        log(err.message)
        return err
      } else if (res.isFile() && Path.extname(filePath) === EXT) {
        onMatch(filePath)
      } else if (res.isDirectory()) {
        doDir(filePath)
      }
    })
}

checkFile(toTest)
setTimeout(() => {
  log(`Found ${FILES} ${EXT} files in ${DIRS} directories`)
  log(`Writing output to ${OUT}`)
  Fs.writeFileSync("./output.JSON", JSON.stringify(toJSON))},
200)
