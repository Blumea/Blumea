const murmurhash = require('murmurhash')
const isLogsActive = require('../logger')

const styles = require('terminal-styles')
const { cyan, x, red, bold, blackBright } = styles

class PartitionedBloomFilter {

    // number of bits in bloom filter
    getSize() {

        let m = -(this.items_count * Math.log(this.false_positive)) / (Math.log(2) ** 2)
        return Math.ceil(m);
    }

    // number of hash functions
    getHashCount() {
        // k = n * items_count
        let k = (this.size * this.items_count)
        return Math.ceil(k)
    }
    constructor(items_count, false_positive) {
        this.logger = isLogsActive()
        this.items_count = items_count;
        this.false_positive = false_positive;
        // this.
        // Prevent invalid false positive rate inputs:
        if (false_positive <= 0.0 || false_positive >= 0.999) {
            false_positive = 0.01; //set to lowest permitted value.
            if (this.logger)
                console.log(styles`${red}${bold}[*]Invalid False positive rate. Updated to: 0.01${x}${x}`)
        }
        this.size = this.getSize()
        this.hash_count = this.getHashCount(this.size, this.items_count)
        this.size = this.size / (this.hash_count)
        this.bit_set = []
        for (let i = 0; i < this.size; i++)
            this.bit_set[i] = 0
    }

    insert(element) {
        let digests = []
        for (let i = 0; i < this.hash_count; ++i) {
            let index = murmurhash.v3(element, i) % this.size
            digests.push(index)
            this.bit_set[index] = 1;
        }
        if (this.logger) {
            console.log(styles`${cyan}${bold}[*]New Element Inserted ${x}${red}=> ${x}${x}` + element)
        }
    }

    find(element) {
        for (let i = 0; i < this.hash_count; i++) {
            let index = Math.ceil(murmurhash.v3(element, i) % this.size)
            if (this.bit_set[index] == 0)
                return false
        }
        if (this.logger)
            console.log(styles`${blackBright}${bold}[*]Element exists. ${x}${x}`)
        return true
    }
}

/*******************
 *  © Blumea | 2022
 * *****************/
module.exports = PartitionedBloomFilter;