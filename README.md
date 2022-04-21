![Blumea](./assets/blumeabanner_static.png)

[![Maintenance](https://img.shields.io/badge/Maintained%3F-Yes-8ebb9c.svg)](https://github.com/Blumea/Blumea "Repo Maintained")
[![Ask Us Anything !](https://img.shields.io/badge/Ask%20Us-Anything-1abc9c.svg)](https://github.com/Blumea "[github.com/Hack-Repository](https://github.com/Blumea)")
[![made-for-Developers](https://img.shields.io/badge/Made%20for-Developers-426658.svg)](https://github.com/Hack-Repository/POTD-GoogleChromeExtension "POTD")
[![GitHub issues](https://img.shields.io/github/issues/Hack-Repository/POTD-GoogleChromeExtension.svg)](https://github.com/Hack-Repository/POTD-GoogleChromeExtension/issues)

### Blumea is an easy to plug Bloom filter solution for your applications.

#### **[Visit Blumea](https://blumea-frontend.pages.dev/ "Blumea Web App")** for product demo and documentations.



## 🔖About
A Bloom filter is a space-efficient probabilistic data structure for determining whether or not an element belongs to a set. Checking the availability of a username, for example, is a set membership problem, with the set being a list of all registered usernames. The cost of efficiency is that it is probabilistic in nature, which implies that some False Positive findings may occur. False positive means that it may indicate that a certain username is already taken when it is not.

## 📝Installation
* ```
  npm i blumea
  ```
OR
* ```
   npm install blumea --save
  ```
---
## Usage
* Require the **Blumea** module into your javascript/typescript application.
  ```javascript
    const blumea = require('blumea')
    OR
    const {/*specific bloom filter option*/} = require('blumea')
  ```
* Once imported, **Blumea** can now be used to create and access various bloom filter options.

* Blumea comes with a **console logger** to monitor the basic logs while using the filter.
* To enable the logger, use the **`-l`** or **`-log`** or **`-blumea`** flag while running your JS/TS or Node.js application
* Using a JS/TS application:
  ```
  node application.js -log
  ```
* Using Node.js server with nodemon:
  ```
  nodemon server.js -l
  ```
---
## Data Structures
### 🔖**Classical Bloom Filter**
#### **Imports:**
* ```javascript
    //import the the class from blumea package
    const {bloomFilterBasic} = require('blumea');
    //create a filter instance with itemCount && falsePositive rate.
    let filter = new bloomFilterBasic(799,0.02)
  ```
#### **Public Access Methods:**
* **insert(element)** : To add the element to the bloom filter instance.
* **find(element)**: To check for element membership with the false positive rate of the **filter**.
* **updateFalsePositiveRate(newFalsePostive)**: To update the filter instance with a new false positive rate.
* **updateItemCount(newItemCount)**: To update the filter instance with a new item count.

* **Utility Methods:**
  * **getHashFunctionCount()** or `filter.hash_count`
  * **getBitArraySize()** or `filter.size`

> **Note:** updateX methods() are experimental. Classical Bloom filters have static false positive rate and item count for a single instance.

#### Usage Warning:
* The false positive rate must not exceed **1.0**. An exception will be thrown if this value is exceeded.
* Valid Range: **0.01 to 0.99**
---
## 📗Platform Support

* Node.js: `v7.0.0 or higher`
* Google Chrome: `v41 or higher`
* Mozilla Firefox: `v34 or higher`
* Microsoft Edge: `v12 or higher`

---
## Application Information

### License
**[MIT License](https://github.com/Blumea/Blumea-npm-package/blob/main/LICENSE "View License")**
### Author
**[Github.com/Blumea](https://github.com/Blumea "Open Github Organisation")**
### Maintainer
**[Akash Chouhan](https://github.com/akashchouhan16 "akashchouhan16")**