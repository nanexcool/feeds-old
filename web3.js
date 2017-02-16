const Web3 = require('web3');

const HOST = process.env.ETH_RPC_HOST || 'localhost';
const PORT = process.env.ETH_RPC_PORT || 8545;
const URL = process.env.ETH_RPC_URL || `http://${HOST}:${PORT}`;

const web3 = new Web3(this.web3 ? this.web3.currentProvider : (
  new Web3.providers.HttpProvider(URL)
));

// if (!web3.isConnected()) {
//   const message = `Could not connect to Ethereum RPC server at ${URL}`;
//   console.log(message);
//   // process.exit(1);
// }

module.exports = web3;
