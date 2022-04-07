const murmurhash = require('murmurhash')

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
    
    
    insert(element){
        let digests = []
        for(let i=0;i<this.hash_count;++i){
            let index = murmurhash.v3(element,i) % this.size
            digests.push(index)
            this.bit_set[index] = 1;
        }
        console.info(`[*] ${element} added.`)
    }

    find(element){
        for(let i=0;i<this.hash_count;i++){
            let index = Math.ceil(murmurhash.v3(element,i) % this.size)
            if(this.bit_set[index] == 0 )
                return false
        }
     return true
    }
}


module.exports = bloomFilterBasic