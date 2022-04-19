/*******************************************
 * copyright: @github.com/Blumea  
 * authors: @akashchouhan16
 * *****************************************
*/

/* Discarded Bit Array Implementation for v1.0.x Need Corrected implementations. */  

buildVector = (bitCount)=> {
  let bits_per_element = 32
  let elementCount = Math.ceil(bitCount / bits_per_element)
  let bet_vector = new Array(elementCount)

  for (let i = 0; i < elementCount; i++) {
    bet_vector[i] = 0
  }
  return bet_vector
}
// Utility methods to create & manipulate the bit array.
const setBit = (bit_vector, index)=>{
  return bit_vector | (1 << index)
}
const getBit = (bit_vector, index)=>{
    const value = bit_vector & (1 << index)
    return value!=0
}

module.exports = {buildVector, setBit, getBit}