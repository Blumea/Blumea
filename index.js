/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16 @singhtaran1005
 * *****************************************
*/

require('./logger/logger').displayLoggerDetails();


const BloomFilter = require('./classicalBloom/main')

const PartitionedBloomFilter = require('./partitionedBloom/main')

const CountingBloomFilter = require('./countingBloom/main')

const ScalableBloomFilter = require('./scalableBloom/main-v2')

// TODO
const CuckooBloomFilter = require('./cuckooBloom/main')

const { buildVector, setBit, getBit } = require('./classicalBloom/bitarray')
const bitArray = { buildVector, setBit, getBit }

module.exports = { BloomFilter, PartitionedBloomFilter, CountingBloomFilter, ScalableBloomFilter, bitArray }