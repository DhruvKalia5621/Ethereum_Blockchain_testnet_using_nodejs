const express = require('express');
const request = require('request');
const Blockchain = require('./blockchain')
const bodyParser = require('body-parser');
const PubSub = require('./publishsubscribe');

const app = express()
const blockchain = new Blockchain();
const pubsub = new PubSub(({ blockchain }))



const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
setTimeout(() => pubsub.broadcastChain(), 1000);


app.use(bodyParser.json());
app.get('/api/blocks', (req, res) => {
    res.json(blockchain.chain) // whatever data is in the blockchain we get that.
   
})



// route handler functon
app.post("/api/mine", (req, res) => {
    const { data } = req.body;
    const {value} = req.body;
    const {From} = req.body;
    const {To} = req.body;
  
    blockchain.addblock({ data , value , From , To }); // will the data in the blockchain
    pubsub.broadcastChain();
    res.redirect('/api/blocks'); // will show the data in the port
});




const synChains= () => {

    request({url:`${ROOT_NODE_ADDRESS}/api/blocks`},(erro,response,body)=>{
      if(!erro && response.statusCode ===200){
        const rootChain = JSON.parse(body);
        // console.log('Replace chain on sync with ', rootChain);
        blockchain.replaceChain(rootChain)
      }  
    })
}


let PEER_PORT;
if (process.env.GENERATE_PEER_PORT === 'true') {

    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
    
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
    console.log(`Listening to PORT: ${PORT}`);
    console.log(`Server is running on http://localhost:${PORT}`);
    synChains();
   
});

app.use(express.static('public')); // Serve static files from the 'public' directory

// app.listen(PORT, () => {
    
// });