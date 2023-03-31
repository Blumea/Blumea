/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16 @singhtaran1005
 * *****************************************
*/
require('dotenv').config()
require('./logger/logger').displayLoggerDetails();


const BloomFilter = require('./bloomFilterBasic/main')

const PartitionedBloomFilter = require('./bloomFilterPartitioned/main')

const CountingBloomFilter = require('./bloomFilterCounting/main')

const CuckooBloomFilter = require('./bloomFilterCuckoo/main')

const { buildVector, setBit, getBit } = require('./bloomFilterBasic/bitarray')
const bitArray = { buildVector, setBit, getBit }

module.exports = { BloomFilter, PartitionedBloomFilter, CountingBloomFilter, CuckooBloomFilter, bitArray }