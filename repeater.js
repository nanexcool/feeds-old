const Repeater = require('./lib/aggregator.js');
const web3 = require('./web3');

module.exports = (address, env) => {
  Repeater.environments[env].aggregator.value = address;
  Repeater.class(web3, env);
  const toString = x => web3.toAscii(x).replace(/\0/g, '');

  const repeater = Repeater.objects.aggregator;

  repeater.inspect = (id) => {
    const owner = repeater.owner(id);
    if (owner === '0x0000000000000000000000000000000000000000') {
      return 'Repeater not claimed';
    }
    const result = {
      id: web3.toDecimal(id),
      owner,
      label: toString(repeater.label(id)),
      feedsQuantity: web3.toDecimal(repeater.feedsQuantity(id)),
      minimumValid: web3.toDecimal(repeater.minimumValid(id)),
      value: web3.toDecimal(repeater.tryGet.call(id)[0]),
    };
    return result;
  };

  repeater.filter = (options, callback) => {
    web3.eth.filter(Object.assign({
      address,
    }, options), (error, event) => {
      if (error) {
        callback(error);
      } else if (!event || !event.topics) {
        callback(new Error(`Bad event: ${event}`));
      } else {
        // callback(null, web3.toDecimal(event.topics[1]));
        callback(null, event.topics[1]);
      }
    });
  };
  return repeater;
};
