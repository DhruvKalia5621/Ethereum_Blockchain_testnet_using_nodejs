const MINE_RATE=1000; // 1s = 1000s
const INITIAL_DIFFICULTY = 2;
const genesis_data = {

    timestamp:1,
    prevHash:'0x0023',
    From: ["----------"],
    To: ["------------"],
    value:["----------"],
    hash:'0x456',
    difficulty:INITIAL_DIFFICULTY,
    nonce:0,
    data:["----------"]
};

module.exports = {genesis_data,MINE_RATE};
