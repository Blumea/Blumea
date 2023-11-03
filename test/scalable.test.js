/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/

const ScalableBloomFilter = require('../build/scalableBloom/main');

describe('Scalable bloom filter tests', () => {
    let filter;

    beforeAll(() => {
        filter = new ScalableBloomFilter(1000, 0.01);
    });

    afterAll(() => {
        filter = null;
    });

    describe('Scalable bloom instance with valid inputs', () => {
        test('Scalable bloom filter instance as not null', () => {
            expect(filter).not.toBe(null);
        });

        test('Scalable bloom instance with valid item_count', () => {
            expect(filter.expectedItems).toEqual(1000);
        });

        test('Scalable bloom instance with valid falsePositiveRate', () => {
            expect(filter.falsePositiveRate).toEqual(0.01);
        });

        test('Scalable bloom instance logger as disabled by default', () => {
            expect(filter.logger).toEqual(false);
        });

        test('Scalable bloom instance scaled by a factor of 2', () => {
            const SIZE = filter.filterSize;
            filter.scaleFilter();
            expect(filter.filterSize).toEqual(SIZE * 2);
        });

        test('inserting and finding an item in Scalable bloom filter', () => {
            filter.insert('foo');
            expect(filter.find('foo')).toBe(true);
        });

        test('inserting and finding a numeric item in Scalable bloom filter (+ case)', () => {
            filter.insert(12345);
            expect(filter.find(12345)).toBe(true);
        })

        test('inserting and finding a numeric item in Scalable bloom filter (- case)', () => {
            filter.insert(123);
            expect(filter.find(1234)).toBe(false);
        })
    });

    describe('Scalable bloom instance with no inputs', () => {
        let filter_2;

        beforeAll(() => {
            filter_2 = new ScalableBloomFilter();
        });

        afterAll(() => {
            filter_2 = null;
        });

        test('Scalable bloom filter instance as not null, using default values', () => {
            expect(filter_2).not.toBe(null);
        });

        test('Scalable bloom instance with null item_count', () => {
            expect(filter_2.expectedItems).toEqual(1000);
        });

        test('Scalable bloom instance with null falsePositiveRate', () => {
            expect(filter_2.falsePositiveRate).toEqual(0.01);
        });

        // test('Scalable bloom invalid not-null falsePositiveRate', () => {
        //     expect(() => {
        //         new ScalableBloomFilter(-1, 0.005);
        //     }).toThrow(Error);
        // });

        test('Scalable bloom with very large item_count and fp rate', () => {
            const filter_3 = new ScalableBloomFilter(7_000_001, 0.999);
            expect(filter_3).not.toBe(null);
        });

        test('inserting and finding an item in invalid Scalable bloom filter', () => {
            filter_2.insert('foo');
            expect(filter_2.find('foo')).toBe(true);
        });
    });
});
