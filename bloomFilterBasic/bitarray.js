// Utility methods to create & manipulate the bit array.
/******** Discarded Bit Array Implementation. Need Corrected implementations. ********
* buildVector()
* setBit()
* getBit()
*/  
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

module.exports = {buildVector, setBit, getBit}