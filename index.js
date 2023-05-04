/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16 @singhtaran1005
 * *****************************************
*/

require('./logger/logger').initialize();


const BloomFilter = require('./build/classicalBloom/main')

const PartitionedBloomFilter = require('./build/partitionedBloom/main')

const CountingBloomFilter = require('./build/countingBloom/main')

const ScalableBloomFilter = require('./build/scalableBloom/main')

const CuckooBloomFilter = require('./build/cuckooBloom/main')

const { buildVector, setBit, getBit } = require('./build/classicalBloom/bitarray')
const bitArray = { buildVector, setBit, getBit }

module.exports = { BloomFilter, PartitionedBloomFilter, CountingBloomFilter, CuckooBloomFilter, ScalableBloomFilter, bitArray }