require('dotenv').config()
const murmurhash = require('murmurhash')
const bloomFilterBasic = require('./bloomFilterBasic/main')
const {buildVector, setBit, getBit} = require('./bloomFilterBasic/bitarray')

const test = ()=>{
    console.log('[*]Blumea Package is ready! :)')
}

module.exports = {test, bloomFilterBasic, buildVector}