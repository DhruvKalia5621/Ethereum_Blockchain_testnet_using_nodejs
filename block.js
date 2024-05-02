const { genesis_data, MINE_RATE } = require('./config');
const cryptoHash = require("./cryptohash");
const hexToBinary = require("hex-to-binary");
class Block {

    constructor({ timestamp, prevHash, From , To ,  value, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.prevHash = prevHash;
        this.From=From;
        this.To = To;
        this.value = value;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;

    }

    static genesis() {

        return new this(genesis_data);
    }

    static mineblock({ prevblock, data , value , From , To }) {
        let hash, timestamp;
        const prevHash = prevblock.hash;
        let { difficulty } = prevblock;
        let nonce = 0;
        do {

            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty({
                originalBlock: prevblock,
                timestamp,
            });
            hash = cryptoHash(timestamp, prevHash, From , To , value, data, nonce, difficulty);
    
        } while (hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this({ // this -> Block

            timestamp,
            prevHash,
            From,
            To,
            value,
            data,
            difficulty,
            nonce,
            hash,
        });
    }

    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;
        if (difficulty < 1) return 1;
        const difference = timestamp - originalBlock.timestamp;
        if (difference > MINE_RATE) {
            return difficulty - 1;
        }
        return difficulty + 1;
    }


}

// const block1 = new Block({
//     timestamp: '2/09/22',
//     prevHash: '0xaveb',
//     hash: '0xc123',
//     data: 'hello'
// });


// const genesisblock = Block.genesis();
// console.log(genesisblock);

// const result = Block.mineblock({prevblock:block1,data:"block2"});
// console.log(result)

module.exports = Block;