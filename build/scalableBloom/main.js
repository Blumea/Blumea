/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/

const { metadata, blumeaLogger } = require('../../logger/logger')
const { warn } = require('console')
const murmurhash = require('murmurhash-js');

class ScalableBloomFilter {
    constructor(expectedItems = 1000, falsePositiveRate = 0.01, hashingFunctions = [murmurhash.murmur3]) {
        try {
            this.logger = metadata.flags.debugActiveMode;

            if (!expectedItems || typeof expectedItems !== 'number' || expectedItems < 1) {
                throw new Error('Expected items must be a positive number.');
            }
            if (!falsePositiveRate || typeof falsePositiveRate !== 'number' || falsePositiveRate < 0.01 || falsePositiveRate > 0.999) {
                throw new Error('False positive rate must be a number between 0.01 and 0.999');
            }
            if (!Array.isArray(hashingFunctions) || hashingFunctions.length === 0) {
                throw new Error('Hashing functions must be a non-empty array');
            }

            this.expectedItems = expectedItems;
            this.falsePositiveRate = falsePositiveRate;
            this.hashingFunctions = hashingFunctions;
            this.filterSize = this.getFilterSize(this.expectedItems, this.falsePositiveRate);
            this.filter = new Uint8Array(this.filterSize);
            this.itemCount = 0;
            this.scalingFactor = 2;

            if (this.logger) {
                blumeaLogger('scalable', 'ScalableBloomFilter instance created.')
            }
        } catch (error) {
            if (this.logger) {
                blumeaLogger('scalable', null, `Error with constructor(): ${error.message}`)
                process.exit(1);
            } else {
                warn(error.message);
                process.exit(1)
            }
        }
    }

    getFilterSize(expectedItems, falsePositiveRate) {
        try {
            const numerator = -1 * expectedItems * Math.log(falsePositiveRate);
            const denominator = Math.pow(Math.log(2), 2);
            const filterSize = Math.ceil(numerator / denominator / 8);
            if (isNaN(filterSize)) {
                throw new Error('Could not calculate filter size');
            }
            return filterSize;
        } catch (error) {
            if (this.logger) {
                blumeaLogger('scalable', null, `Error with getFilterSize(): ${error.message}`)
            } else {
                warn(error.message);
            }
        }
    }

    *hash(item, seed) {
        try {
            for (const hashingFunction of this.hashingFunctions) {
                yield hashingFunction(item, seed) % this.filterSize;
            }
        } catch (error) {
            if (this.logger) {
                blumeaLogger('scalable', null, `Error with generator func(): ${error.message}`)
            } else {
                warn(error.message);
            }
        }
    }

    insert(item) {
        try {
            if (!item) {
                throw new Error(`${item} is an invalid input.`);
            } else if (typeof item !== 'string') {
                item = item.toString();
            }

            const hashes = this.hash(item, 0);
            for (const hash of hashes) {
                this.filter[hash] = 1;
            }
            this.itemCount++;
            if (this.itemCount > this.filterSize * this.scalingFactor) {
                this.scaleFilter();
            }

            if (this.logger) {
                blumeaLogger('scalable', `${item} added to the filter.`);
            }
        } catch (error) {
            if (this.logger) {
                blumeaLogger('scalable', null, `Error with insert(): ${error.message}`);
            } else {
                warn(error.message);
            }
        }
    }

    find(item) {
        try {
            if (!item) {
                throw new Error(`${item} is an invalid input.`);
            } else if (typeof item !== 'string') {
                item = item.toString();
            }
            const hashes = this.hash(item, 0);
            for (const hash of hashes) {
                if (this.filter[hash] === 0) {
                    if (this.logger) {
                        blumeaLogger('scalable', `${item} does not exist.`);
                    }
                    return false;
                }
            }

            if (this.logger) {
                blumeaLogger('scalable', `${item} exists.`);
            }
            return true;
        } catch (error) {
            if (this.logger) {
                blumeaLogger('scalable', null, `Error with find(): ${error.message}`);
            } else {
                warn(error.message);
            }
        }
    }


    scaleFilter() {
        try {
            const oldFilter = this.filter;
            const oldFilterSize = this.filterSize;
            this.filterSize *= this.scalingFactor;
            this.filter = new Uint8Array(this.filterSize);
            this.itemCount = 0;
            for (let i = 0; i < oldFilterSize; i++) {
                if (oldFilter[i] === 1) {
                    const item = Math.floor(i / this.hashingFunctions.length);
                    this.insert(item);
                }
            }
            if (this.logger) {
                blumeaLogger('scalable', `Bloom filter was scaled by a factor ${this.scalingFactor}`);
            }
        } catch (error) {
            if (this.logger) {
                blumeaLogger('scalable', null, `Error with scaleFilter(): ${error.message}`);
            } else {
                warn(error.message);
            }
        }
    }
}

/*******************
 *  © Blumea | 2023
 * *****************/
module.exports = ScalableBloomFilter;