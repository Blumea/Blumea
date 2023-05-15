/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/

const PartitionedBloomFilter = require('../build/partitionedBloom/main');

describe('Partitioned bloom filter tests', () => {
    let filter;

    beforeEach(() => {
        filter = new PartitionedBloomFilter(1000, 0.01);
    });

    afterEach(() => {
        filter = null;
    });

    describe('Partitioned bloom instance with valid inputs', () => {
        test('Partitioned bloom filter instance as not null', () => {
            expect(filter).not.toBe(null);
        });

        test('Partitioned bloom instance with valid item_count', () => {
            expect(filter.items_count).toEqual(1000);
        });

        test('Partitioned bloom instance with valid false_positive', () => {
            expect(filter.false_positive).toEqual(0.01);
        });

        test('Partitioned bloom instance logger as disabled by default', () => {
            expect(filter.logger).toEqual(false);
        });

        test('Partitioned bloom instance optimal hash func count', () => {
            expect(filter.getHashCount()).toBe(7);
        });

        test('inserting and finding an item in Partitioned bloom filter', () => {
            filter.insert('foo');
            expect(filter.find('foo')).toBe(true);
        });
    });

    describe('Partitioned bloom instance with invalid inputs', () => {
        let filter_2;

        beforeEach(() => {
            filter_2 = new PartitionedBloomFilter(null, null);
        });

        afterEach(() => {
            filter_2 = null;
        });

        test('Partitioned bloom filter instance as not null, using fallback values', () => {
            expect(filter_2).not.toBe(null);
        });

        test('Partitioned bloom instance with null item_count', () => {
            expect(filter_2.items_count).toEqual(10000);
        });

        test('Partitioned bloom instance with null false_positive', () => {
            expect(filter_2.false_positive).toEqual(0.01);
        });

        test('Partitioned bloom invalid not-null false_positive', () => {
            const filter_3 = new PartitionedBloomFilter(-1, 0.005);
            expect(filter_3.false_positive).toEqual(0.01);
        });

        test('Partitioned bloom invalid not-null item_count', () => {
            const filter_3 = new PartitionedBloomFilter(-1, 0.005);
            expect(filter_3.items_count).toEqual(10000);
        });

        test('inserting and finding an item in invalid Partitioned bloom filter', () => {
            filter_2.insert('foo');
            expect(filter_2.find('foo')).toBe(true);
        });
    });
});
