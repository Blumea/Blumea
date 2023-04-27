![blumeabanner_static](https://user-images.githubusercontent.com/56465610/215418750-3eb64619-5a69-48d1-949f-2af3c492a5d4.png)

[![npm version](https://badge.fury.io/js/blumea.svg)](https://badge.fury.io/js/blumea)
![GitHub Workflow Status (with branch)](https://img.shields.io/github/actions/workflow/status/blumea/blumea/dependency-review.yml?&label=%20build)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-Yes-1dbf73.svg)](https://github.com/Blumea/Blumea "Repo Maintained")
[![made-for-Developers](https://img.shields.io/badge/Made%20for-Developers-426658.svg)](https://github.com/Blumea/Blumea "Blumea")
[![Ask Us Anything !](https://img.shields.io/badge/Ask%20Us-Anything-1abc9c.svg)](https://github.com/Blumea "[github.com/Hack-Repository](https://github.com/Blumea)")
[![GitHub issues](https://img.shields.io/github/issues/Blumea/Blumea.svg)](https://github.com/Blumea/Blumea/issues)

# Blumea
Blumea is a simple and efficient Bloom filter implementation for your applications. It's designed to help you determine whether an element belongs to a set in a space-efficient way.

## 🔖 About Bloom Filters
A Bloom filter is a probabilistic data structure that allows you to test if an element is in a set. It does so by using a bit array and multiple hash functions to check if a given element is likely to be in the set or not. This makes Bloom filters ideal for use cases where space is at a premium, or when you need to test for set membership quickly.

One common example of where Bloom filters are useful is in checking the availability of usernames. Here, the set is the list of all registered usernames, and Bloom filters can be used to determine if a new username is already taken. The downside of Bloom filters is that they are probabilistic in nature and can sometimes give false positives (indicating that an element is in the set when it isn't).

---

## 📝 Installation
* You can install Blumea via npm by running:
  ```
  npm i blumea
  ```
* Alternatively, you can save the latest dependency by running:
  ```
   npm i blumea@latest --save
  ```
---

## 📗 Usage
To start using Blumea in your JavaScript or TypeScript project, you need to first import it. This can be done using either of the following methods:
* **ES5** import could be done as follows:
  ```javascript
    const blumea = require('blumea')

    // import one or more bloom filters
    const { BloomFilter } = require('blumea')
  ```
* Alternatively, for **ES6** or later versions:
  ```javascript
    import * as blumea from 'blumea'

    //// import one or more bloom filters
    import { BloomFilter } from 'blumea'

  ```
* After importing Blumea into your project, you can create and access different bloom filter options.
* Blumea includes a logger module to monitor basic logs while using the filter. 
* To enable the logger, use one of the following flags while running your JavaScript/TypeScript or Node.js application: **`-l`, `-log`, or `-blumea`**.
  * Here are examples of how to enable the logger:
    ```
      node application.js -blumea
    ```
  * Alternatively, applications with start scripts could use:
    ```
      npm run <app-script> -log
    ```

---

## 🏗️ Data Structures
### 1. 🔖**Classical Bloom Filter**

#### **About**
Classical Bloom Filters are an extension of Bloom Filters that use a bit array and hash functions to represent the membership of an element in a set. They are probabilistic data structures used for membership testing with applications in web caching, spell checkers, virus scanners, Content Delivery Networks (CDN) and network routers.
#### **How to import?**
To import the BloomFilter class from the Blumea package into your project, use the following:
  ```javascript
    const { BloomFilter } = require('blumea');

    /**
     * Create a Bloom filter instance for your app.
     * Provide item count and an acceptable false positive rate.
     */ 

    let filter = new BloomFilter(9700, 0.01);
  ```
By passing the desired item count and false positive rate as arguments to the BloomFilter constructor, you can create a Bloom filter instance with the appropriate settings for your use case.


#### **Methods:**
* **insert(element)** : To add the element to the bloom filter instance.
* **find(element)**: To check for element membership with the false positive rate of the **filter**.
* **updateFalsePositiveRate(newFalsePostive)**: To update the filter instance with a new false positive rate.
* **updateItemCount(newItemCount)**: To update the filter instance with a new item count.

* **Utility Methods:**
  * **getHashFunctionCount()** or `filter.hash_count`
  * **getBitArraySize()** or `filter.size`

  > **Note:** updateX methods() are experimental. Classical Bloom filters have static false positive rate and item count for a single instance.

* Refer **[Note](https://github.com/blumea/blumea#note)** for more.

**Sample Code Snipet**:
  ```javascript
    const { BloomFilter } = require('blumea')
    const { log } = require('log')
    let filter = new BloomFilter(1024, 0.01)


    filter.insert('James Clear')
    filter.insert('Paulo Coelho')

    log(filter.find('blumea')) // return false.
    log(filter.find('Paulo Coelho')) // return true.

    log(filter.getHashFunctionCount()) //return the optimal hash func count.

    //Experimental:
    const fpRate = 0.0;
    const itemCount = 4096;

    // throws warning & filter updates fp rate to 0.01.
    filter.updateFalsePositiveRate(fpRate); 

    // itemCount updated, instance refreshes other parameters.
    filter.updateItemCount(itemCount)

    // return the new optimal count.
    log(filter.getHashFunctionCount()) 
  ```
---

### 2. 🔖**Counting Bloom Filter**

#### **About**
Counting Bloom Filters are a variant of Bloom Filters that allow adding and removing items efficiently. Rather than simply setting bits to indicate the presence of an item, Counting Bloom Filters keep a count of the number of times an item has been added. This allows the removal of items by decrementing their count, and also reduces the chance of false positives. Counting Bloom Filters are useful when items need to be added and removed from the filter, but at the cost of increased memory usage. Prime use cases include Network traffic management, Web caching and Transactional Fraud detection.
#### **How to import?**
To import the BloomFilter class from the Blumea package into your project, use the following:
  ```javascript
    const { CountingBloomFilter } = require('blumea');

    /**
     * Create a Bloom filter instance for your app.
     * Provide item count and an acceptable false positive rate.
     */ 

    let filter = new CountingBloomFilter(5999, 0.03);
  ```
#### **Methods:**
* **insert(element)** : To add the element to the bloom filter instance.
  - When an element is added to the Counting Bloom Filter with a single bit count, the filter increments the count of that element every time it is added. This count is maintained in the `count_bit` array for each element in the filter.

* **find(element)**: To check for element membership with the false positive rate of the **filter**.
<!-- * **updateFalsePositiveRate(newFalsePostive)**: To update the filter instance with a new false positive rate.
* **updateItemCount(newItemCount)**: To update the filter instance with a new item count. -->

* **Utility Methods:**
  * **getHashFunctionCount()** or **filter.hash_count**
  * **getBitArraySize()** or **filter.size**

* Refer **[Note](https://github.com/blumea/blumea#note)** for more.

**Sample Node app with Counting Bloom Filter**:
  ```javascript
    const express = require('express')
    const { CountingBloomFilter } = require('blumea'),
    const app = express();
    
    // Initialize counting bloom filter
    const filter = new CountingBloomFilter(5999, 0.03);
    
    // Route to check for username availability
    app.post('/check-username', (req,res)=>{
        try {
            const username = req.body.username;
            if(!username) {
              // Handle invalid input case
            } else {
              /**
               * Check if username is available using filter.
               * Saves network bandwidth on db queries.
               * */
    
              if(filter.find(username))
                res.send(`${username} already in use.`)
              else
                res.send(`${username} is available.`)
            }
        } catch (e) {
          // Handle errors
        }
    })
    
    app.listen(3000, ()=> {console.log (`Server live on PORT: ${3000}`);})

  ```
---
### 3. 🔖**Partitioned Bloom Filter**

#### **About**
A Partitioned Bloom Filter (PBF) is a probabilistic data structure that allows efficient set membership testing. A PBF consists of multiple independent Bloom filters, each of which has a unique hash function. The Bloom filters are divided into partitions, and each partition is allocated a portion of the overall bit array used by the PBF. Each element is hashed by each of the unique hash functions, and the resulting hash values are used to set bits in the corresponding partitions of the Bloom filters.
#### **How to import?**
To import the BloomFilter class from the Blumea package into your project, use the following:
  ```javascript
    const { PartitionedBloomFilter } = require('blumea');

    /**
     * Create a Bloom filter instance for your app.
     * Provide item count and an acceptable false positive rate.
     */ 

    let filter = new PartitionedBloomFilter(5999, 0.03, 2);
  ```
#### **Methods:**
* **insert(element)** : This function inserts a new element into the bloom filter by setting the appropriate bits in each partition's bit set based on the hash values of the element.

* **find(element)** : This function checks if a given element is present in the bloom filter by checking the appropriate bits in each partition's bit set based on the hash values of the element. It returns false if any of the bits are zero, indicating that the element is definitely not in the bloom filter, or true if all of the bits are one, indicating that the element may be in the bloom filter.

* **initializeBitSet()** : Initializes the bit set for each partition of the bloom filter.

* **getPartitionIndex(element)** : Calculates and returns the index of the partition that a given element should belong to.

* **getHashCountPerPartition()** : Calculates and returns the number of hash functions to use in each partition of the bloom filter based on the size of each partition and the number of items in each partition.

* **getSizePerPartition()** : Calculates and returns the size of each partition in the bloom filter based on the number of items in each partition and the desired false positive rate.

* **Utility Methods:**
  * **getHashCount()** or **filter.hash_count**
  * **getSize()** or **filter.size**

* Refer **[Note](https://github.com/blumea/blumea#note)** for more.

**Sample Node app with Partition Bloom Filter**:
  ```javascript
    const { PartitionedBloomFilter } = require('blumea')

    // Create a new Partitioned Bloom Filter with 100 items, 0.05 false positive rate, and 4 partitions.
    const pbf = new PartitionedBloomFilter(100, 0.05, 4)

    // Insert some elements
    pbf.insert('foo')
    pbf.insert('bar')

    // Check if an element exists in the filter
    console.log(pbf.find('foo')) // Returns true
    console.log(pbf.find('baz')) // Returns false

    // Check the number of hash functions used in each partition
    console.log(pbf.getHashCountPerPartition())
```
---
### 4. 🔖**Cuckoo Bloom Filter**

#### **About**
A cuckoo bloom filter is a variation of a Bloom filter, which is a probabilistic data structure used for efficient set membership testing. Like a Bloom filter, a cuckoo bloom filter represents a set of items as a bit array, but it uses two hash functions and two hash tables instead of one.
Cuckoo bloom filters offer better performance than standard Bloom filters for some use cases, but they are more complex to implement and require more memory. They are commonly used in network routers, firewalls, and other applications where fast and efficient set membership testing is required.
#### **How to import?**
To import the BloomFilter class from the Blumea package into your project, use the following:
  ```javascript
    const { CuckooBloomFilter } = require('blumea');

    /**
     * Create a Bloom filter instance for your app.
     * Provide item count and an acceptable false positive rate.
     */ 

    let filter = new CuckooBloomFilter(2999, 0.01);
  ```
#### **Methods:**
* **insert(element)** : : This function inserts the given element into the filter. It hashes the element using multiple hash functions and tries to place it in one of the two tables. If both tables have already occupied the slots, it performs cuckoo hashing by swapping the current element with the existing one and trying to insert the swapped element. If cuckoo hashing fails after a certain number of attempts, the function returns false. If the element is successfully inserted, the function returns true.

* **find(element)** : This function checks if the given element exists in the filter. It hashes the element using the same hash functions used during insertion and checks if the corresponding slots in either table contain the element. If the element is found, the function returns true. If the element is not found, the function returns false.

* **Utility Methods:**
  * **getHashCount()** or **filter.hash_count**
  * **getSize()** or **filter.size**

* Refer **[Note](https://github.com/blumea/blumea#note)** for more.

**Sample Node app with Cuckoo Bloom Filter**:
  ```javascript
    const { CuckooBloomFilter } = require('blumea')

    // Create a new Cuckoo Bloom Filter with 100 items, 0.05 false positive rate.
    const cf = new CuckooBloomFilter(100, 0.05)

    // Insert some elements
    cf.insert('apple')
    cf.insert('banana')
    cf.insert('strawberry')

    // Check if an element exists in the filter
    console.log(cf.contains('banana')) // Returns true
    console.log(cf.contains('mango')) // Returns false

    // Check the number of hash functions used in the filer
    console.log(cf.getHashCount())
```
---
### 5. 🔖**Scalable Bloom Filter**
#### **About**
Scalable Bloom Filters are designed to be scalable and can handle an arbitrary number of items and adjust size dynamically while using multiple hash functions to generate a set of bits to identify the item's presence. They have real-life applications such as:

- **Web Cache Optimization**: Quickly determine whether a requested web page is present in the cache.
- **Distributed Systems**: Reducing distributed network traffic by identifying specific nodes without querying each one individually to find an item.
- **Database Indexing**: Accelerating database queries by using it as an index to facilitate range queries and swiftly filtering if a record is absent from a table.

#### **How to import?**
To import the BloomFilter class from the Blumea package into your project, use the following:
  ```javascript
    const { ScalableBloomFilter } = require('blumea');

    /**
     * Create a Bloom filter instance for your app.
     * Default values (itemCount: 1000, falsePostiveRate: 0.01) is used.
     */ 

    let filter = new ScalableBloomFilter();
  ```
#### **Methods:**
* **insert(element)** : To add the element to the bloom filter instance.
    > Insertion checks for the available size and would automatically scale the filter by a factor of 2, as and when needed.

* **find(element)**: To check for element membership with the false positive rate of the **filter**.

* **About Custom Parameters:**
  * ScalableBloomFilter's constructor can accept an array of custom hash functions as the third parameter.
  * ```ts
      new ScalableBloomFilter(
          expectedItems?: number,
          falsePositiveRate?: number,
          hashFunctions?: hashFunction []
      ): ScalableBloomFilter
    ```
  * Function Prototype for acceptable hash function:
    ```ts
      hashingFunction: ((str: string, seed?: number | undefined) => number)
      ```

* Refer **[Note](https://github.com/blumea/blumea#note)** for more.

**Sample app to add Todos with a Scalable Bloom**:
  ```javascript
    
    const { ScalableBloomFilter } = require('blumea'),
    
    class TODO {

      constructor () {
        /*
         * Initialize scalable bloom filter.
         * Default config is for 1000 items at 0.01 fp rate.
         * Filter auto-scales by a factor of 2 when needed. 
         */
       this.filter = new ScalableBloomFilter();
      }

      /* 
        TODO: {
          _id: uuid(),
          title: string,
          deadline: Date,
          desc: string 
          } 
      */ 
      addTodo (todo) {
        
        if (filter.find(todo._id)) {
          // handle case.
        } else {
  
          /*
           * Write todo to DB & update filter.
           * code to insert to DB goes here.
           */ 
          filter.insert(todo._id); //auto-scales during insert.
        }
      }
      // add custom implementations
    }

  ```
---

## ❗Note
- Please note that the false positive rate in a Bloom filter should not exceed 0.999. If this value is exceeded, an exception will be thrown.

- The valid range for false positive rates is between **0.01** and **0.999**.

---

## 🚧 Support Details

* Node.js: v7.0.0 or higher
* Google Chrome: v41 or higher
* Mozilla Firefox: v34 or higher
* Microsoft Edge: v12 or higher

---
## 📦 Application Details

### License
**[MIT License](https://github.com/Blumea/Blumea-npm-package/blob/main/LICENSE "View License")** - **[Github.com/Blumea](https://github.com/Blumea "Open Github Organization")**

### Maintainer
**[Akash Chouhan](https://github.com/akashchouhan16 "akashchouhan16")**
### Author(s)
- **[Akash Chouhan](https://github.com/akashchouhan16 "akashchouhan16")**
- **[Taranpreet Singh Chabbra](https://github.com/singhtaran1005 "singhtaran1005")**

