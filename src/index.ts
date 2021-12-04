const truffleConfig = require('../truffle-config');
const Web3 = require('web3');

const { port, host, from: ownerAddress, network_id: networkId } = truffleConfig.networks.ganache;

const Subscription = require('../build/contracts/Subscription.json');
const contractAddress = Subscription.networks[networkId].address;
const contractAbi = Subscription.abi;

const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(`http://${host}:${port}`));
const subscriptionContract = new web3.eth.Contract(contractAbi, contractAddress);

const operationName = process.argv[2];
const payload = process.argv[3];

const subscribe = async (address) => {
  try {
    await subscriptionContract.methods.subscribe().send({ from: address, value: 1000000000 });
    console.log(`Wallet ${address} subscribed. Just payed 1000000000 wei`);
  } catch (err) {
    console.error(err);
  }
};

const getBalance = async () => {
  try {
    const contractBalance = await subscriptionContract.methods.getBalance().call({ from: ownerAddress });
    console.log(`Current balance is: ${contractBalance} wei`);
  } catch (err) {
    console.error(err);
  }
};

const withdraw = async () => {
  try {
    await getBalance();
    await subscriptionContract.methods.withdraw().send({ from: ownerAddress });
    console.log(`Withdrawn ETH from contract`);
  } catch (err) {
    console.error(err);
  }
};

const remove = async () => {
  try {
    await getBalance();
    await subscriptionContract.methods.remove().send({ from: ownerAddress });
    console.log(`contract at ${contractAddress} destroyed`);
  } catch (err) {
    console.error(err);
  }
};

const operations = {
  subscribe,
  getBalance,
  withdraw,
  remove,
};

operations[operationName](payload)
  .then(() => {
    console.log('Done');
  })
  .catch((err) => {
    console.error(err);
  });
