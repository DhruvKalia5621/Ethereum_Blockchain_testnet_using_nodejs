let account;

var transactionhash = "";
var Balance12 = "";
var From_transaction = "";
var To_transaction = "";
document.getElementById('connect-button').addEventListener('click', event => {

    let button = event.target;
    const Holder_address = document.getElementById('Holder_address');
    const Connection_status = document.getElementById('Connection_status');
    let z = document.getElementById('copy-button');

    const Holder_Balance = document.getElementById('Holder_Balance');
    ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        account = accounts[0];
        From_transaction = account;


        // button.textContent = account;
        Holder_address.innerText = account;
        z.style.display = "block";
        Connection_status.innerHTML = "Connected";




        ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] }).then(result => {
            console.log(result);
            let wei = parseInt(result, 16);
            let balance = wei / (10 ** 18);
            console.log(balance + "ETH");
            Holder_Balance.innerHTML = balance + " ETH";

        });
    });
});







let OtherAccount_inlist = "";
let send_amount = "";
let x1;
let y1;
document.getElementById('send-button').addEventListener('click', event => {
    var OtherAccount = document.getElementById('OtherAccount').value;
    OtherAccount_inlist = OtherAccount;
    To_transaction = OtherAccount;

    // Function to convert Ether to Wei
    function etherToWei(ether) {
        // Convert Ether to Wei
        return BigInt(Math.floor(ether * 10 ** 18));
    }

    // Function to convert Wei to hexadecimal
    function weiToHex(wei) {
        // Convert BigInt Wei to hexadecimal
        return '0x' + wei.toString(16);
    }

    let etherAmount = parseFloat(document.getElementById('AmountToSend').value);
    if (!isNaN(etherAmount)) {
        // Convert Ether to Wei
        let weiValue = etherToWei(etherAmount);

        // Convert Wei to hexadecimal
        let hexValue = weiToHex(weiValue);

        // Assign the hexadecimal value to variable x
        var x = hexValue;
        send_amount = x;
        Balance12 = x;



        console.log("x: ", x); // Output the value of x
    } else {
        console.error("Invalid input: Not a number");
    }
    let transactionParam = {
        to: OtherAccount,
        from: account,
        value: x
    };


    ethereum.request({ method: 'eth_sendTransaction', params: [transactionParam] }).then(txhash => {
        console.log(txhash);
        transactionhash = txhash;
        sendPostRequest();
        checkTransactionconfirmation(txhash).then(r => {
            fetchBlockchainData();
            alert(r);

        });
    });
});


function Copy_button() {

    let x = account;
    navigator.clipboard.writeText(x);
    let y = document.getElementById('copyicon');
    if (y.name === 'copy-outline') {
        y.name = 'checkmark-done-outline';
        y.classList.add('border', 'border-gray-600', ' w-8');
    }
    else {
        y.name = 'copy-outline';
    }
}




function checkTransactionconfirmation(txHash) {

    let checkTransactionLoop = () => {
        return ethereum.request({ method: 'eth_getTransactionReceipt', params: [txHash] }).then(r => {
            if (r != null) return 'confirmed';
            else return checkTransactionLoop();
        });
    };

    return checkTransactionLoop();

}


let inputElement = document.getElementById("input1");

async function fetchBlockchainData() {
    try {
        const response = await fetch('/api/blocks');
        const blockchain = await response.json();
        // const blockchainDataElement = document.getElementById('blockchainData');
        const blockchainTableBody = document.getElementById('blockchainTableBody');
        // blockchainDataElement.innerText = JSON.stringify(blockchain, null, 2);
        let total_number_of_blocks = document.getElementById('total_number_of_blocks');

        // Clear previous table rows
        blockchainTableBody.innerHTML = '';
        let index = 1;

        // const x_sender = localStorage.getItem('sender_account');
        // const y_recipient = localStorage.getItem('recipient');


        // Populate table rows with blockchain data
        blockchain.forEach(block => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">${block.data}</th>
                <td class="px-6 py-4">${index}</td>
                <td class="px-6 py-4">${block.timestamp}</td>
                <td class="px-6 py-4">${block.From}</td>
                <td class="px-6 py-4">${block.To}</td>
                <td class="px-6 py-4">${block.value}</td>
                <td class="px-6 py-4">${block.difficulty}</td>
                <td class="px-6 py-4">${block.nonce}</td>
                <td class="px-6 py-4">${block.prevHash}</td>
                <td class="px-6 py-4">${block.hash}</td>
                
               
            `;
            blockchainTableBody.appendChild(row);
            index++;
            total_number_of_blocks.innerText = index - 1;
        });


    } catch (error) {
        console.error('Error fetching blockchain data:', error);
    }
}

async function sendPostRequest() {
    try {
        data = await { "data": transactionhash, "value": Balance12, "From": From_transaction, "To": To_transaction };
        const response = await fetch('/api/mine', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            console.log('POST request sent successfully');
            // Optionally, fetch and display updated blockchain data after sending the POST request


            fetchBlockchainData();
        } else {
            console.error('Failed to send POST request:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending POST request:', error);
    }
}



fetchBlockchainData();

