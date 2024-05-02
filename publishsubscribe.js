

const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: "BLOCKCHAIN"
}

class PubSub {

    constructor({ blockchain }) {

        this.blockchain = blockchain;

        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        this.subscriber.subscribe(CHANNELS.TEST);
        this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);

        this.subscriber.on('message', (channel, message) =>
            this.handleMessage(channel, message)
        );
    }
    handleMessage(channel, message) {
        // console.log(`Message recieved, Channel: ${channel} Message:${message}`);
        const parseMessage = JSON.parse(message);
        console.log(`Message recieved, Channel: ${channel}` , parseMessage);
        // console.log(`Message recieved, Channel: ${channel} Message:${message}` , parseMessage);
        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parseMessage);
        }
    }

    publish({ channel, message }) {
        this.publisher.publish(channel, message);
    }

    broadcastChain(){
        this.publish({
            channel:CHANNELS.BLOCKCHAIN,
            message:JSON.stringify(this.blockchain.chain),
        });
    }


}

// const checkPunSub = new PubSub();
// setTimeout(
//     () => checkPunSub.publisher.publish(CHANNELS.TEST, 'Hello World!'), 1000
// );

module.exports = PubSub;


