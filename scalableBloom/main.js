/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * note: Test module for v1.0.7
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive, blumeaLogger } = require('../logger/logger')
const { logConfig } = require('../logger/config');
const { warn } = require('console')


class ScalableBloomFilter {
    constructor(item_count, false_positive, initial_capacity = 1000, growth_factor = 2) {
        this.logger = isLogsActive();

        if (!item_count || Number(item_count) > 7_000_000 || item_count <= 0) {
            item_count = 10000;
            if (this.logger) {
                blumeaLogger('scalable', null, 'Invalid expected item count. Updated to: 10000');
            }
        }

        if (!initial_capacity || Number(initial_capacity) > 7_000_000 || initial_capacity <= 0) {
            initial_capacity = 10000;
            if (this.logger) {
                blumeaLogger('scalable', null, 'Invalid initial_capacity. Updated to: 10000');
            }
        }
        if (!false_positive || false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01;
            if (this.logger) {
                blumeaLogger('scalable', null, 'Invalid False positive rate. Updated to: 0.01');
            }

        }

        if (!growth_factor || growth_factor >= 5 || growth_factor <= 0) {
            growth_factor = 2;
            if (this.logger) {
                blumeaLogger('scalable', null, 'Invalid growth_factor. Updated to: 2');
            }
        }
        this.item_count = Number(item_count);
        this.false_positive = Number(false_positive);
        this.initial_capacity = Number(initial_capacity);
        this.growth_factor = Number(growth_factor);

        this.currentFilter = new BloomFilter(item_count, false_positive, initial_capacity);
        this.filters = [this.currentFilter];
        this.itemCount = 0;

        if (this.logger) {
            blumeaLogger('scalable', 'ScalableBloomFilter instance created.');
        }
    }

    insert(element) {
        try {
            if (this.currentFilter.isFull()) {
                this.currentFilter = new BloomFilter(this.item_count, this.false_positive, this.initial_capacity * this.growth_factor);
                this.filters.push(this.currentFilter);
            }
            this.currentFilter.insert(element);
            this.itemCount++;

            if (this.logger) {
                blumeaLogger('scalable', `${element} added to the filter.`);
            }

        } catch (e) {
            if (this.logger) {
                blumeaLogger('scalable', null, 'Error with filter instance.')
                warn(e);
            }
        }
    }

    find(element) {
        try {
            for (const filter of this.filters) {
                if (filter.find(element)) {
                    if (this.logger) {
                        blumeaLogger('scalable', `${element} exists.`);

                    }
                    return true;
                }
            }
        } catch (e) {
            if (this.logger) {
                blumeaLogger('scalable', null, 'Error with filter instance.');
                warn(e.message);
            }
        }

        if (this.logger) {
            blumeaLogger('scalable', `${element} does not exist.`);
        }
        return false;
    }

    get size() {
        let totalSize = 0;
        for (const element of this.filters) {
            totalSize += element.size;
        }
        return totalSize;
    }
}


// Private BloomFilter class without item or fp rate update option.
class BloomFilter {
    constructor(item_count, false_positive, size) {
        this.item_count = item_count;
        this.false_positive = false_positive;
        this.size = size;
        // TODO: Uint8Array to be used for space efficiency.
        this.bitArray = new Array(size).fill(false);
        this.hashFunctions = this.getHashFunctions();
        this.itemCount = 0;
    }

    getHashFunctions() {
        const hashCount = Math.ceil((this.size / this.item_count) * Math.log(2));
        const hashFunctions = [];
        for (let i = 0; i < hashCount; i++) {
            hashFunctions.push(this.getHashFunction(i));
        }
        return hashFunctions;
    }

    getHashFunction(seed) {
        return (item) => {
            const itemStr = JSON.stringify(item);
            let hash = 0;
            for (let i = 0; i < itemStr.length; i++) {
                const char = itemStr.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash &= hash; // Convert to 32bit integer
            }
            return Math.abs(seed * hash) % this.size;
        }
    }

    insert(item) {
        try {
            if (!item) {
                throw new Error('Invalid input element (' + element + ')')
            }
            if (typeof item !== 'string') {
                item = item.toString();
            }

            for (const element of this.hashFunctions) {
                const hash = element(item);
                this.bitArray[hash] = true;
            }
            this.itemCount++;
        } catch (e) {
            if (this.logger) {
                blumeaLogger('scalable', null, 'Error with filter instance.');
                warn(e.message);
            }
        }
    }

    find(item) {
        try {
            if (!item) {
                throw new Error('Invalid input element (' + element + ')')
            }
            if (typeof item !== 'string') {
                item = item.toString();
            }

            for (const element of this.hashFunctions) {
                const hash = element(item);
                if (!this.bitArray[hash]) {
                    return false;
                }
            }
        } catch (e) {
            if (this.logger) {
                blumeaLogger('scalable', null, 'Error with filter instance.');
                warn(e.message);
            }
        }
        return true;
    }

    isFull() {
        return this.itemCount >= this.item_count;
    }
}


module.exports = ScalableBloomFilter;