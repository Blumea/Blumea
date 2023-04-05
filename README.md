![blumeabanner_static](https://user-images.githubusercontent.com/56465610/215418750-3eb64619-5a69-48d1-949f-2af3c492a5d4.png)

[![Maintenance](https://img.shields.io/badge/Maintained%3F-Yes-8ebb9c.svg)](https://github.com/Blumea/Blumea "Repo Maintained")
[![Ask Us Anything !](https://img.shields.io/badge/Ask%20Us-Anything-1abc9c.svg)](https://github.com/Blumea "[github.com/Hack-Repository](https://github.com/Blumea)")
[![made-for-Developers](https://img.shields.io/badge/Made%20for-Developers-426658.svg)](https://github.com/Blumea/Blumea "Blumea")
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

#### ❗Usage Warning:
- Please note that the false positive rate in a Bloom filter should not exceed 0.999. If this value is exceeded, an exception will be thrown.

- The valid range for false positive rates is between 0.001 and 0.999.

**Sample Code Snipet**:
  ```javascript
    const {BloomFilter} = require('blumea')
    let filter = new BloomFilter(20,0.03)


    filter.insert('James Clear')
    filter.insert('Paulo Coelho')

    console.log(filter.find('blumea')) //return false.
    console.log(filter.find('Paulo Coelho')) //return true.

    console.log(filter.getHashFunctionCount()) //return the optimal hash func count.

    filter.updateFalsePositiveRate(0.0) //warning thrown and filter will update the rate to 0.01.
    filter.updateItemCount(50) //updates the item count & recompute parameters.
    console.log(filter.getHashFunctionCount()) //return the new optimal hash func count.
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
    > When an element is added to the Counting Bloom Filter with a single bit count, the filter increments the count of that element every time it is added. This count is maintained in the `count_bit` array for each element in the filter.

* **find(element)**: To check for element membership with the false positive rate of the **filter**.
* **updateFalsePositiveRate(newFalsePostive)**: To update the filter instance with a new false positive rate.
* **updateItemCount(newItemCount)**: To update the filter instance with a new item count.

* **Utility Methods:**
  * **getHashFunctionCount()** or **filter.hash_count**
  * **getBitArraySize()** or **filter.size**


#### ❗Usage Warning:
- Please note that the false positive rate in a Bloom filter should not exceed 0.999. If this value is exceeded, an exception will be thrown.

- The valid range for false positive rates is between 0.001 and 0.999.

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

## 🚧 Support Details

* Node.js: v7.0.0 or higher
* Google Chrome: v41 or higher
* Mozilla Firefox: v34 or higher
* Microsoft Edge: v12 or higher

---
## 📦 Application Details

### License
**[MIT License](https://github.com/Blumea/Blumea-npm-package/blob/main/LICENSE "View License")**
### Author
**[Github.com/Blumea](https://github.com/Blumea "Open Github Organization")**
### Maintainer
**[Akash Chouhan](https://github.com/akashchouhan16 "akashchouhan16")**
