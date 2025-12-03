const {Buffer} = require('buffer');

const memoryContainer=Buffer.alloc(4)

const diffCount=Buffer.allocUnsafe(4)

for(let i=0;i<diffCount.length;i++){
    if(diffCount[i]!==0){
        console.log(`Index ${i}:${diffCount[i].toString(2)}`)
    }
}