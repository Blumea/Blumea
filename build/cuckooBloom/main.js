/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @singhtaran1005
 * *****************************************
*/
const murmurhash = require('murmurhash')
const { isLogsActive, blumeaLogger } = require('../../logger/logger')

class CuckooBloomFilter {
    // Utility methods.
    getSize() {
        let m = -(this.items_count * Math.log(this.false_positive)) / (Math.log(2) ** 2);
        return Math.ceil(m);
    }
    getHashCount() {
        let k = Math.ceil(Math.log(2) * (this.size / this.items_count));
        return k;
    }
    // Cuckoo Bloom filter instance initialization:
    constructor(items_count, false_positive) {
        this.logger = isLogsActive();
        // Prevent invalid item_count:
        if (!items_count || Number(items_count) > 7_000_000 || items_count <= 0) {
            items_count = 10000; //set to lowest safe permitted value.
            if (this.logger) {
                blumeaLogger('cuckoo', null, 'Invalid item count, updated to: 10000.');
            }
        }
        // Prevent invalid false positive rate inputs:
        if (false_positive >= 0.999 || false_positive < 0.01) {
            false_positive = 0.01;
            if (this.logger) {
                blumeaLogger('cuckoo', null, 'Invalid false positive rate, updated to: 0.01.');
            }
        }
        // Prevent invalid hash count values
        if (hash_count <= 0) {
            hash_count = 1;
            if (this.logger) {
                blumeaLogger('cuckoo', null, 'Invalid number of hash functions, updated to: 1.');
            }
        }
        this.items_count = Number(items_count);
        this.false_positive = Number(false_positive);
        this.size = this.getSize(this.items_count, this.false_positive);
        this.hash_count = this.getHashCount(this.size, this.items_count);
        this.table1 = new Array(this.size).fill(0);
        this.table2 = new Array(this.size).fill(0);
        if (this.logger) {
            blumeaLogger('cuckoo', 'CuckooBloomFilter instance created.');
        }
    }

    // Primary Method definitions:
    insert(element) {
        try {
            let index1 = murmurhash.v3(element) % this.size;
            let index2 = murmurhash.v3(element, 1) % this.size;
            if (this.table1[index1] == 0) {
                this.table1[index1] = element;
                if (this.logger) {
                    blumeaLogger('cuckoo', `${element} added to table1.`);
                }
                return true;
            } else if (this.table2[index2] == 0) {
                this.table2[index2] = element;
                if (this.logger) {
                    blumeaLogger('cuckoo', `${element} added to table2.`);
                }
                return true;
            } else {
                // Both slots occupied. Perform cuckoo hashing.
                let victim = element;
                for (let i = 0; i < this.hash_count; i++) {
                    let index = murmurhash.v3(victim, i) % this.size;
                    if (this.table1[index] == 0) {
                        this.table1[index] = victim;
                        if (this.logger) {
                            blumeaLogger('cuckoo', `Cuckoo hash with ${element} at table2[${index2}] replaced with ${victim} at table1[${index}].`);
                        }
                        return true;
                    } else if (this.table2[index] == 0) {
                        this.table2[index] = victim;
                        if (this.logger) {
                            blumeaLogger('cuckoo', `Cuckoo hash with ${element} at table1[${index1}] replaced with ${victim} at table2[${index}].`);
                        }
                        return true;
                    } else {
                        // Both slots still occupied. Swap the current element with the existing one.
                        let tmp = this.table1[index];
                        this.table1[index] = victim;
                        victim = tmp;
                        index = murmurhash.v3(victim, i) % this.size;
                        if (this.table2[index] == 0) {
                            this.table2[index] = victim;
                            if (this.logger) {
                                blumeaLogger('cuckoo', `Cuckoo hash with ${element} at table1[${index1}] replaced with ${victim} at table2[${index}].`);
                            }
                            return true;
                        }
                    }
                }
                // Cuckoo hashing failed after `hash_count` attempts.
                if (this.logger) {
                    blumeaLogger('cuckoo', `Cuckoo hashing failed for ${element}.`);
                }
                return false;
            }
        } catch (err) {
            if (this.logger) {
                blumeaLogger('cuckoo', null, `Error with insert(): ${err.message}`);
            } else {
                warn(err.message);
            }
            return false;
        }
    }
    find(element) {
        try {
            let index1 = murmurhash.v3(element) % this.size;
            let index2 = murmurhash.v3(element, 1) % this.size;
            if (this.logger) {
                blumeaLogger('cuckoo', `${element} found in the filter.`);
            }
            return this.table1[index1] == element || this.table2[index2] == element;
        } catch (err) {
            if (this.logger) {
                blumeaLogger('cuckoo', null, `Error with find(): ${err.message}`);
            } else {
                warn(err.message);
            }
            return false;
        }
    }
}

/*******************
 *  © Blumea | 2023
 * *****************/
module.exports = CuckooBloomFilter;