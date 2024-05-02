const Block = require('./block');
const cryptoHash = require('./cryptohash');

class Blockchain {

    constructor() {
        this.chain = [Block.genesis()]; // Array containing the chain of blocks
        
    }

    addblock({ data , value , From , To }) {
        const newblock = Block.mineblock({
            prevblock: this.chain[this.chain.length - 1],
            data, value , From , To
        })
      
        this.chain.push(newblock);

      
      
    }

   
   

    replaceChain(chain) {

        if (chain.length <= this.chain.length) {
            console.error("The Incoming Chain is not longer");
            return;
        }
        if (!Blockchain.isValidChain(chain)) {
            console.error("The Incoming chain is not valid ");
            return;
        }
        this.chain = chain;
    }

    static isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            return false; // we converted then into string because we cannot compare two different instances instances
        }
        for (let i = 1; i < chain.length; i++) {
            const { timestamp, prevHash, From , To , value, hash, nonce, difficulty, data } = chain[i];
            const lastDifficulty = chain[i - 1].difficulty;
            const realLastHash = chain[i - 1].hash;

            if (prevHash !== realLastHash) {
                return false;
            }
            const validatedHash = cryptoHash(timestamp, prevHash, From , To ,  value, nonce, difficulty, data );
            if (hash !== validatedHash) {
                return false;
            }
            if (Math.abs(lastDifficulty - difficulty) > 1) return false; // that difference must be only one between  each block. like 3 and 2 or 4 and 5 both have a difference of 1.
        }
        return true;

    }
}

// const blockchain = new Blockchain();
// blockchain.addblock({data:"Block1"});
// blockchain.addblock({data:"Block2"});
// console.log(blockchain);

// const result = Blockchain.isValidChain(blockchain.chain);
// console.log(blockchain.chain);
// console.log(result);

module.exports = Blockchain;