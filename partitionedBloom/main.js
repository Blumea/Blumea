/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @singhtaran1005
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive, blumeaLogger } = require('../logger/logger')


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

        // Prevent invalid item_count:
        if (!items_count || Number(items_count) > 7_000_000 || items_count <= 0) {
            items_count = 10000; //set to lowest safe permitted value.
            if (this.logger) {
                blumeaLogger('partitioned', null, 'Invalid item count, updated to: 10000.');
            }
        }

        // Prevent invalid false positive rate inputs:
        if (false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01;
            if (this.logger) {
                blumeaLogger('partitioned', null, 'Invalid false positive rate, updated to: 0.01.');
            }
        }
        // TODO: add a check for partitions_count

        this.items_count = Number(items_count);
        this.false_positive = Number(false_positive);
        this.partitions_count = Number(partitions_count);
        this.size = this.getSize(this.items_count, this.false_positive);
        this.hash_count = this.getHashCount(this.size, this.items_count);

        this.bit_set = [];
        for (let i = 0; i < this.partitions_count; i++) {
            this.bit_set[i] = [];
            for (let j = 0; j < this.size / this.partitions_count; j++) this.bit_set[i][j] = 0;
        }
        if (this.logger) {
            blumeaLogger('partitioned', 'PartitionedBloomFilter instance created.');
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
        try {
            for (let i = 0; i < this.hash_count; ++i) {
                let index = murmurhash.v3(element, i) % (this.size / this.partitions_count);
                let partition_index = Math.floor(murmurhash.v3(element, i) % this.partitions_count);
                this.bit_set[partition_index][index] = 1;
            }
            if (this.logger) {
                blumeaLogger('partitioned', `${element} added to the filter.`);
            }
        } catch (e) {
            blumeaLogger('partitioned', null, 'Error with insert().');
            warn(e.message);
        }
    }
    find(element) {
        try {
            for (let i = 0; i < this.hash_count; i++) {
                let index = Math.ceil(murmurhash.v3(element, i) % (this.size / this.partitions_count));
                let partition_index = Math.floor(murmurhash.v3(element, i) % this.partitions_count);

                if (this.bit_set[partition_index][index] == 0) {
                    if (this.logger) {
                        blumeaLogger('partitioned', `${element} does not exist.`);
                    }
                    return false;
                }
            }
            if (this.logger) {
                blumeaLogger('partitioned', `${element} exists.`);
            }
        } catch (e) {
            blumeaLogger('partitioned', null, 'Error with find().');
            warn(e.message);
            return false;
        }
        return true;
    }
}

/*******************
 *  © Blumea | 2023
 * *****************/
module.exports = PartitionedBloomFilter;