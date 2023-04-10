/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive } = require('../logger/logger')
const { log, warn } = require('console')

const styles = require('terminal-styles')
const { magenta, x, red, bold, blackBright } = styles

class ScalableBloomFilter {
    constructor(item_count, false_positive, initial_capacity = 1000, growth_factor = 2) {
        this.logger = isLogsActive();
        this.item_count = item_count;
        this.false_positive = false_positive;
        this.initial_capacity = initial_capacity;
        this.growth_factor = growth_factor;

        if (!item_count || Number(item_count) > 7_000_000 || item_count <= 0) {
            item_count = 10000;
            if (this.logger) {
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid expected item count. Updated to: 10000${x}${x}]`)
            }
        }

        if (!initial_capacity || Number(initial_capacity) > 7_000_000 || initial_capacity <= 0) {
            initial_capacity = 10000;
            if (this.logger) {
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid initial_capacity. Updated to: 10000${x}${x}]`)
            }
        }
        if (!false_positive || false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01;
            if (this.logger) {
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid False positive rate. Updated to: 0.01${x}${x}]`)
            }

        }

        if (!growth_factor || growth_factor >= 5 || growth_factor <= 0) {
            growth_factor = 2;
            if (this.logger) {
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid growth_factor. Updated to: 2${x}${x}]`)
            }
        }

        this.currentFilter = new BloomFilter(item_count, false_positive, initial_capacity);
        this.filters = [this.currentFilter];
        this.itemCount = 0;

        if (this.logger) {
            log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${magenta}${bold}ScalableBloomFilter instance created.${x}${x}]`)
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
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + element + styles`${magenta}${bold} added to the filter.${x}${x}]`)
            }

        } catch (e) {
            if (this.logger) {
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${red}${bold}Error with filter instance.${x}${x}]`)
                warn(e);
            }
        }
    }

    find(element) {
        try {
            for (let i = 0; i < this.filters.length; i++) {
                if (this.filters[i].find(element)) {
                    if (this.logger) {
                        log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ${element}` + styles`${magenta}${bold} already exists.${x}${x}]`)
                    }
                    return true;
                }
            }
        } catch (e) {
            if (this.logger) {
                log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ` + styles`${red}${bold}Error with filter instance.${x}${x}]`)
                warn(e);
            }
        }

        if (this.logger) {
            log(`[type: ` + styles`${magenta}${bold}Scalable Bloom beta${x}${x}, ` + `log: ${element}` + styles`${magenta}${bold} does not exist.${x}${x}]`)
        }
        return false;
    }

    get size() {
        let totalSize = 0;
        for (let i = 0; i < this.filters.length; i++) {
            totalSize += this.filters[i].size;
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
            for (let i = 0; i < this.hashFunctions.length; i++) {
                const hash = this.hashFunctions[i](item);
                this.bitArray[hash] = true;
            }
            this.itemCount++;
        } catch (e) {
            if (this.logger) {
                log(styles`${red}${bold}Error with filter instance.${x}${x}`);
                warn(e);
            }
        }
    }

    find(item) {
        try {
            for (let i = 0; i < this.hashFunctions.length; i++) {
                const hash = this.hashFunctions[i](item);
                if (!this.bitArray[hash]) {
                    return false;
                }
            }
        } catch (e) {
            if (this.logger) {
                log(styles`${red}${bold}Error with filter instance.${x}${x}`);
                warn(e);
            }
        }
        return true;
    }

    isFull() {
        return this.itemCount >= this.item_count;
    }
}


module.exports = ScalableBloomFilter;