/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive } = require('../logger/logger')
const { log, warn } = require('console')

const styles = require('terminal-styles')
const { x, red, bold, blue } = styles


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
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid Item count. Updated to: 10000${x}${x}]`)
            }
        }

        // Prevent invalid false positive rate:
        if (!false_positive || false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01; //set to lowest safe permitted value.
            if (this.logger) {
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid False positive rate. Updated to: 0.01${x}${x}]`)
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
            log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${blue}${bold}CountingBloomFilter instance created.${x}${x}]`)
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
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + element + styles`${blue}${bold} added to the filter${x}${x}, ` + `Count: ` + element_count + `]`)
            }
        } catch (e) {
            if (this.logger) {
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}error with insert() method${x}${x}, ` + e.message + `]`)
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
                        log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + element + styles`${blue}${bold} does not exist${x}${x}]`)
                    }
                    return false;
                }
            }

            if (this.logger) {
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + element + styles`${blue}${bold} exists${x}${x}]`)
            }
        } catch (e) {
            if (this.logger) {
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}error with find() method${x}${x}, ` + e.message + `]`)
            }
            return false;
        }
        return true;
    }


    // secondary utility methods to access or update the bloom filter parameters.
    updateItemCount(newItemCount) {
        // Prevent invalid item_count:
        if (!newItemCount || Number(newItemCount) > 7_000_000 || newItemCount <= 0) {
            newItemCount = 10000;
            if (this.logger) {
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid Item count. Updated to: 10000${x}${x}]`)
            }
        }
        this.items_count = newItemCount
        this.size = this.getSize(this.item_count, this.false_positive)
        this.hash_count = this.getHashCount(this.size, this.items_count)
        this.bit_set = []

        for (let i = 0; i < this.size; i++)
            this.bit_set[i] = 0
        if (this.logger) {
            log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${blue}${bold}Item Count updated to: ${x}${x}` + this.items_count + `]`)
        }
    }

    updateFalsePositiveRate(newFalsePostive) {
        if (!newFalsePostive || newFalsePostive <= 0.0 || newFalsePostive >= 0.999) {
            if (this.logger) {
                log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid False positive rate. Updated to: 0.01${x}${x}]`)
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
            log(`[type: ` + styles`${blue}${bold}Counting Bloom${x}${x}, ` + `log: ` + styles`${blue}${bold}False positive rate updated to:${x}${x}` + this.false_positive + `]`)
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
 *  © Blumea | 2022
 * *****************/
module.exports = CountingBloomFilter;