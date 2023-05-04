/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { metadata, blumeaLogger } = require('../../logger/logger')
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
        this.logger = metadata.flags.debugActiveMode;

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

    /**
    * Inserts an element into the filter.
    * @param {string} element - The element to insert.
    */
    insert(element, count = 0) {
        try {
            if (!element) {
                throw new Error(`Invalid input element (${element})`)
            }
            if (typeof element !== 'string') {
                element = element.toString();
            }
            if (count && typeof count !== 'number') {
                throw new Error(`Invalid element's initial count (${element})`)
            }

            let element_count = 0;
            let digests = []
            for (let i = 0; i < this.hash_count; ++i) {
                let index = murmurhash.v3(`${element}`, i) % this.size;
                digests.push(index);

                if (count && count > 1) {
                    this.bit_set[index].count_bit = count;
                    element_count = count;
                } else {
                    this.bit_set[index].count_bit += 1;
                    element_count = this.bit_set[index].count_bit;
                }

                this.bit_set[index].values.push(element);

            }
            if (this.logger) {
                blumeaLogger('counting', `${element} added to the filter, Count: ${element_count}`);
            }
        } catch (error) {
            if (this.logger) {
                blumeaLogger('counting', null, `Error with insert(): ${error.message}`)
            } else {
                warn(error.message);
            }
        }
    }

    /**
    * Checks whether an element is in the filter.
    * @param {string} element - The element to search for.
    * @returns {boolean} - True if the element is in the filter, false otherwise.
    */
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
        } catch (error) {
            if (this.logger) {
                blumeaLogger('counting', null, `Error with find(): ${error.message}`)
            } else {
                warn(error.message);
            }
            return false;
        }
        return true;
    }

    /**
    * Checks whether an element is in the filter and extracts count.
    * @param {string} element - The element to search for.
    * @returns {number} - count if the element is in the filter, 0 otherwise.
    */
    getCount(element) {
        try {
            if (!element) {
                throw new Error('Invalid input element (' + element + ')')
            }
            if (typeof element !== 'string') {
                element = element.toString();
            }

            let count = 0;
            for (let i = 0; i < this.hash_count; i++) {
                const index = Math.ceil(murmurhash.v3(element, i) % this.size);
                if (!this.bit_set[index] || !this.bit_set[index].hasOwnProperty('count_bit') || this.bit_set[index].count_bit === 0) {
                    if (this.logger) {
                        blumeaLogger('counting', `${element} does not exist.`);
                    }
                    return 0;
                } else {
                    count = this.bit_set[index].count_bit;
                }
            }

            if (this.logger) {
                blumeaLogger('counting', `${element} exists with Count: ${count}.`);
            }
            return count;
        } catch (error) {
            if (this.logger) {
                blumeaLogger('counting', null, `Error with getCount(): ${error.message}.`)
            } else {
                warn(error.message);
            }
            return 0;
        }
    }

    // Discarded
    #updateItemCount(newItemCount) {
        if (typeof newItemCount !== 'number') {
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
        this.size = this.getSize()
        this.hash_count = this.getHashCount()
        this.bit_set = []

        for (let i = 0; i < this.size; i++)
            this.bit_set[i] = 0
        if (this.logger) {
            blumeaLogger('counting', `Item Count updated to: ${this.items_count}`);
        }
    }

    #updateFalsePositiveRate(newFalsePostive) {
        if (!newFalsePostive || newFalsePostive <= 0.0 || newFalsePostive >= 0.999) {
            if (this.logger) {
                blumeaLogger('counting', null, 'Invalid false positive rate, updated to: 0.01.');
            }
            newFalsePostive = 0.01;
        }
        this.false_positive = newFalsePostive;
        this.size = this.getSize()
        this.hash_count = this.getHashCount()
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