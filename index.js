require('dotenv').config()
const murmurhash = require('murmurhash')


const test = ()=>{
    console.log('[*]Blumea Package is ready! :)')
}

/*
******** Discarded Bit Array Implementation. Need Corrected implementations. ********
* buildVector()
* setBit()
* getBit()
*/ 

// Utility methods to manipulate bit array. 
buildVector = (bitCount)=> {
  let bits_per_element = 32
  let elementCount = Math.ceil(bitCount / bits_per_element)
  let bet_vector = new Array(elementCount)

  for (let i = 0; i < elementCount; i++) {
    bet_vector[i] = 0
  }
  return bet_vector
}
const setBit = (bit_vector, index)=>{
  return bit_vector | (1 << index)
}
const getBit = (bit_vector, index)=>{
    const value = bit_vector & (1 << index)
    return value!=0
}


class bloomFilterBasic{
    getSize(){
        let m = -(this.items_count * Math.log(this.false_positive))/(Math.log(2)**2)
        return Math.ceil(m);
    }
    getHashCount(){
        let k = (this.size/this.items_count) * Math.log(2)
        return Math.ceil(k); 
    }
    constructor(items_count, false_positive) {
        this.items_count = items_count;
        this.false_positive = false_positive;

        this.size = this.getSize(this.item_count, this.false_positive)
        this.hash_count = this.getHashCount(this.size, this.items_count)
        this.bit_set = []
        for(let i=0;i<this.size;i++)
            this.bit_set[i] = 0
    }
    
    
    add(element){
        let digests = []
        for(let i=0;i<this.hash_count;++i){
            let index = murmurhash.v3(element,i) % this.size
            // console.log(`Element: ${element}, HashIndex: ${index}`)
            digests.push(index)
            this.bit_set[index] = 1;
        }
        console.info(`[*] ${element} added.`)
    }

    lookup(element){
        for(let i=0;i<this.hash_count;i++){
            let index = Math.ceil(murmurhash.v3(element,i) % this.size)
            if(this.bit_set[index] == 0 )
                return false

        }
     return true
    }
}


module.exports = {test, bloomFilterBasic, buildVector}