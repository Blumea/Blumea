/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @singhtaran1005
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive } = require('../logger/logger')

const styles = require('terminal-styles')
const { cyan, x, red, bold, blackBright } = styles

class PartitionedBloomFilter {
    // Utility methods.
    getSize() {
        let m = -(this.items_count * Math.log(this.false_positive)) / (Math.log(2) ** 2);
        return Math.ceil(m);
    }
    getHashCount() {
        let k = (this.size / this.items_count) * Math.log(2);
        return Math.ceil(k);
    }
    // Partitioned Bloom filter instance initialization:
    constructor(items_count, false_positive, partitions_count) {
        this.logger = isLogsActive();
        this.items_count = items_count;
        // Prevent invalid false positive rate inputs:
        if (false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01; //set to lowest safe permitted value.
            if (this.logger) log(`[type: ` + styles`${cyan}${bold}Partitioned Bloom${x}${x}, ` + `log: ` + styles`${red}${bold}Invalid False positive rate. Updated to: 0.01${x}${x}]`);
        }
        this.false_positive = false_positive;
        this.size = this.getSize(this.items_count, this.false_positive);
        this.hash_count = this.getHashCount(this.size, this.items_count);
        this.partitions_count = partitions_count;
        this.bit_set = [];
        for (let i = 0; i < this.partitions_count; i++) {
            this.bit_set[i] = [];
            for (let j = 0; j < this.size / this.partitions_count; j++) this.bit_set[i][j] = 0;
        }
        if (this.logger) {
            log(`[type: ` + styles`${cyan}${bold}Partitioned Bloom${x}${x}, ` + `log: ` + styles`${cyan}${bold}PartitionedBloomFilter instance created.${x}${x}]`);
        }
    }
    // Get the size of each partition
    getSizePerPartition() {
        const m = -(this.itemsCountPerPartition * Math.log(this.falsePositiveRate)) / (Math.log(2) ** 2)
        return Math.ceil(m)
    }

    // Get the number of hash functions for each partition
    getHashCountPerPartition() {
        const k = (this.sizePerPartition / this.itemsCountPerPartition) * Math.log(2)
        return Math.ceil(k)
    }

    // Initialize the bit set for each partition
    initializeBitSet() {
        const bitSet = []
        for (let i = 0; i < this.numberOfPartitions; i++) {
            bitSet.push(new Array(this.sizePerPartition).fill(0))
        }
        return bitSet
    }

    // Get the index of the partition for an element
    getPartitionIndex(element) {
        const hash = murmurhash.v3(element)
        return hash % this.numberOfPartitions
    }
    // Primary Method definitions:
    insert(element) {
        for (let i = 0; i < this.hash_count; ++i) {
            let index = murmurhash.v3(element, i) % (this.size / this.partitions_count);
            let partition_index = Math.floor(murmurhash.v3(element, i) % this.partitions_count);
            this.bit_set[partition_index][index] = 1;
        }
        if (this.logger) {
            log(`[type: ` + styles`${cyan}${bold}Partitioned Bloom${x}${x}, ` + `log: ` + styles`${cyan}${bold}New Element Inserted${x}${x}` + styles`${cyan}(${x}` + element + styles`${cyan})${x} ]`);
        }
    }
    find(element) {
        for (let i = 0; i < this.hash_count; i++) {
            let index = Math.ceil(murmurhash.v3(element, i) % (this.size / this.partitions_count));
            let partition_index = Math.floor(murmurhash.v3(element, i) % this.partitions_count);
            if (this.bit_set[partition_index][index] == 0) {
                return false;
            }

        }
    }
}

/*******************
 *  © Blumea | 2023
 * *****************/
module.exports = PartitionedBloomFilter;