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


module.exports = { BloomFilter, PartitionedBloomFilter, CountingBloomFilter, CuckooBloomFilter, ScalableBloomFilter }