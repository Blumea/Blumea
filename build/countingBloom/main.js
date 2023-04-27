/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive, blumeaLogger } = require('../../logger/logger')
const { warn } = require('console')



class CountingBloomFilter {

    getSize() {
        let m = -(this.items_count * Math.log(this.false_positive)) / (Math.log(2) ** 2)
        return Math.ceil(m);
    }
    getHashCount() {
        let k = (this.size / this.items_count) * Math.log(2)
        return Math.ceil(k);
    }

    // Bloom filter instance initialization:
    constructor(items_count, false_positive) {
        this.logger = isLogsActive();

        // Prevent invalid item_count:
        if (!items_count || Number(items_count) > 7_000_000 || items_count <= 0) {
            items_count = 10000; //set to lowest safe permitted value.
            if (this.logger) {
                blumeaLogger('counting', null, 'Invalid item count, updated to: 10000.');
            }
        }

        // Prevent invalid false positive rate:
        if (!false_positive || false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01;
            if (this.logger) {
                blumeaLogger('counting', null, 'Invalid False positive rate. Updated to: 0.01.')
            }
        }

        this.items_count = items_count;
        this.false_positive = false_positive;
        this.size = this.getSize();
        this.hash_count = this.getHashCount();
        this.bit_set = [] //Array of Object

        for (let i = 0; i < this.size; i++)
            this.bit_set[i] = {
                count_bit: 0, //count bit for specific element
                values: []
            }

        if (this.logger) {
            blumeaLogger('counting', 'CountingBloomFilter instance created.');
        }
    }

    // Primary Method definitions:
    insert(element) {
        try {
            if (!element) {
                throw new Error('Invalid input element (' + element + ')')
            }
            if (typeof element !== 'string') {
                element = element.toString();
            }

            let element_count = 0;
            let digests = []
            for (let i = 0; i < this.hash_count; ++i) {
                let index = murmurhash.v3(`${element}`, i) % this.size;
                digests.push(index);
                this.bit_set[index].count_bit += 1; //count bit
                this.bit_set[index].values.push(element);
                element_count = this.bit_set[index].count_bit;
            }
            if (this.logger) {
                blumeaLogger('counting', `${element} added to the filter, Count: ${element_count}`);
            }
        } catch (e) {
            if (this.logger) {
                blumeaLogger('counting', null, 'Error with insert().');
                warn(e.message);
            }
        }
    }

    find(element) {
        try {
            if (!element) {
                throw new Error('Invalid input element (' + element + ')')
            }
            if (typeof element !== 'string') {
                element = element.toString();
            }

            for (let i = 0; i < this.hash_count; i++) {
                const index = Math.ceil(murmurhash.v3(element, i) % this.size);
                if (!this.bit_set[index] || !this.bit_set[index].hasOwnProperty('count_bit') || this.bit_set[index].count_bit === 0) {
                    if (this.logger) {
                        blumeaLogger('counting', `${element} does not exist.`);
                    }
                    return false;
                }
            }

            if (this.logger) {
                blumeaLogger('counting', `${element} exists.`);
            }
        } catch (e) {
            if (this.logger) {
                blumeaLogger('counting', null, 'Error with find().');
                warn(e.message);
            }
            return false;
        }
        return true;
    }


    // secondary utility methods to access or update the bloom filter parameters.
    updateItemCount(newItemCount) {
        if (typeof newItemCount !== 'Number') {
            newItemCount = Number(newItemCount);
        }
        // Prevent invalid item_count:
        if (!newItemCount || Number(newItemCount) > 7_000_000 || newItemCount <= 0) {
            newItemCount = 10000;
            if (this.logger) {
                blumeaLogger('counting', null, 'Invalid Item count, updated to: 10000');
            }
        }
        this.items_count = newItemCount
        this.size = this.getSize(this.item_count, this.false_positive)
        this.hash_count = this.getHashCount(this.size, this.items_count)
        this.bit_set = []

        for (let i = 0; i < this.size; i++)
            this.bit_set[i] = 0
        if (this.logger) {
            blumeaLogger('counting', `Item Count updated to: ${this.items_count}`);
        }
    }

    updateFalsePositiveRate(newFalsePostive) {
        if (!newFalsePostive || newFalsePostive <= 0.0 || newFalsePostive >= 0.999) {
            if (this.logger) {
                blumeaLogger('counting', null, 'Invalid false positive rate, updated to: 0.01.');
            }
            newFalsePostive = 0.01;
        }
        this.false_positive = newFalsePostive;
        this.size = this.getSize(this.item_count, this.false_positive)
        this.hash_count = this.getHashCount(this.size, this.items_count)
        this.bit_set = []

        for (let i = 0; i < this.size; i++)
            this.bit_set[i] = 0
        if (this.logger) {
            blumeaLogger('counting', `False positive rate updated to: ${this.false_positive}`);
        }
    }

    getHashFunctionCount() {
        return this.hash_count;
    }
    getBitArraySize() {
        return this.size;
    }
}

/*******************
 *  © Blumea | 2023
 * *****************/
module.exports = CountingBloomFilter;