
const Block = require('./block');
const Blockchain = require('./blockchain');

const blockchain = new Blockchain();
blockchain.addblock({ data:"new data"});
console.log(blockchain.chain[blockchain.chain.length-1]);
let prevTimestamp, nextTimestamp, nextblock, timeDiff, averageTime;

const times = [];

for (let i = 0; i < 1000; i++) {
    prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addblock({ data: `block ${i}` });
    nextblock = blockchain.chain[blockchain.chain.length - 1];
    nextTimestamp = nextblock.timestamp;
   


    timeDiff = nextTimestamp - prevTimestamp;
    times.push(timeDiff);

    averageTime = times.reduce((total, num) => (total + num)) / times.length;
    console.log(`Time to mine block : ${timeDiff}ms, Difficulty: ${nextblock.difficulty}, Nonce :${nextblock.nonce}, Hash : ${nextblock.prevHash}, Average Time per mining: ${averageTime}ms`);
}