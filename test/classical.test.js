/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/

const BloomFilter = require('../build/classicalBloom/main');

describe('Classical bloom filter tests', () => {
    let filter;

    beforeAll(() => {
        filter = new BloomFilter(1000, 0.01);
    });

    afterAll(() => {
        filter = null;
    });

    describe('Classical bloom instance with valid inputs', () => {
        test('classical bloom filter instance as not null', () => {
            expect(filter).not.toBe(null);
        });

        test('classical bloom instance with valid item_count', () => {
            expect(filter.items_count).toEqual(1000);
        });

        test('classical bloom instance with valid false_positive', () => {
            expect(filter.false_positive).toEqual(0.01);
        });

        test('classical bloom instance logger as disabled by default', () => {
            expect(filter.logger).toEqual(false);
        });

        test('classical bloom instance optimal hash func count', () => {
            expect(filter.getHashCount()).toBe(7);
        });

        test('inserting and finding an item in classical bloom filter', () => {
            filter.insert('foo');
            expect(filter.find('foo')).toBe(true);
        });
    });

    describe('Classical bloom instance with invalid inputs', () => {
        let filter_2;

        beforeAll(() => {
            filter_2 = new BloomFilter(null, null);
        });

        afterAll(() => {
            filter_2 = null;
        });

        test('classical bloom filter instance as not null, using fallback values', () => {
            expect(filter_2).not.toBe(null);
        });

        test('classical bloom instance with null item_count', () => {
            expect(filter_2.items_count).toEqual(10000);
        });

        test('classical bloom instance with null false_positive', () => {
            expect(filter_2.false_positive).toEqual(0.01);
        });

        test('classical bloom invalid not-null false_positive', () => {
            const filter_3 = new BloomFilter(-1, 0.005);
            expect(filter_3.false_positive).toEqual(0.01);
        });

        test('classical bloom invalid not-null item_count', () => {
            const filter_3 = new BloomFilter(-1, 0.005);
            expect(filter_3.items_count).toEqual(10000);
        });

        test('inserting and finding an item in invalid classical bloom filter', () => {
            filter_2.insert('foo');
            expect(filter_2.find('foo')).toBe(true);
        });
    });
});
