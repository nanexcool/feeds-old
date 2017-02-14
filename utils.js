const web3 = require('./web3');

function toBytes(number, bytes) {
  let hex = web3.fromDecimal(number).replace('0x', '');
  while (hex.length < bytes * 2) hex = `0${hex}`;
  return `0x${hex}`;
}

function toBytes12(number) {
  return toBytes(number, 12);
}

module.exports = {
  toBytes,
  toBytes12,
  getNetwork: () => (
    new Promise((resolve, reject) => {
      web3.version.getNetwork((error, result) => {
        if (error) {
          reject(error);
        } else {
          // Private network
          const network = result > 3 ? 4 : result;
          const env = [null, 'live', 'morden', 'ropsten', 'develop'][network];
          resolve(env);
        }
      });
    })
  ),
  getAccounts: () => (
    new Promise((resolve, reject) => {
      web3.eth.getAccounts((error, accounts) => {
        if (error) {
          reject(error);
        } else {
          resolve(accounts);
        }
      });
    })
  ),
};