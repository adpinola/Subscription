const HDWalletProvider = require('@truffle/hdwallet-provider');
const { mnemonic, endpoint } = require('./environment.json').rinkeby;

module.exports = {
  networks: {
    ganache: {
      host: 'localhost',
      port: 7545,
      network_id: 5777,
      gas: 300000,
      from: '0x7da6A85aE424B55Fa9A69e96489bcCdead21b066',
    },
    rinkeby: {
      provider() {
        return new HDWalletProvider(mnemonic, endpoint);
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },
  },
  compilers: {
    solc: {
      version: '^0.8.10',
    },
  },
  plugins: ['solidity-coverage'],
};
