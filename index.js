#!/usr/local/bin/node

// Deps and imports
const fs = require('fs')
const path = require('path')

// Generic helpers
const log = x => (console.log(x), x)
const nlog = (...x) => (x.forEach(log), x[0])
const genericCallback = (err, res) => log(err ? err : res)

// file helpers

// Check if run standalone or imported
const MAIN = !module.parent // Falsy if imported

if (MAIN) {
  nlog('Hey man, you call me from outside, aight ?', path.resolve('.'))
}
