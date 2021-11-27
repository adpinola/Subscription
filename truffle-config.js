module.exports = {
  networks: {
    ganache: {
      host: "localhost",
      port: 7545,
      network_id: 5777,
      gas: 300000,
      from: "0x7da6A85aE424B55Fa9A69e96489bcCdead21b066",
    },
  },
  compilers: {
    solc: {
      version: "^0.8.10",
    },
  },
};
