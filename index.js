/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16 @singhtaran1005
 * *****************************************
*/ 
require('dotenv').config()
const version = require('./package.json').version

const bloomFilterBasic = require('./bloomFilterBasic/main')
const {buildVector, setBit, getBit} = require('./bloomFilterBasic/bitarray')
const bitArray = {buildVector, setBit, getBit}


module.exports = {bloomFilterBasic, bitArray}