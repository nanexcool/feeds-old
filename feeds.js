#! /usr/bin/env node

const pkg = require('./package.json');
const prettyjson = require('prettyjson');
const program = require('commander');
// const CLI = require('clui');
const inquirer = require('inquirer');
const Preferences = require('preferences');
const web3 = require('./web3');
const utils = require('./utils');
const feedbase = require('./feedbase');
const repeater = require('./repeater');

// const Spinner = CLI.Spinner;
// const status = new Spinner('Connecting to network...');

const prefs = new Preferences('com.makerdao.feeds');

function dump(data) {
  // console.log(prettyjson.render(data, options));
  console.log(JSON.stringify(data, null, 2));
}

function clearPreferences() {
  Object.keys(prefs).forEach((prop) => {
    delete prefs[prop];
  });
}
function showAccountSelector() {
  const question = [
    {
      name: 'account',
      message: 'Select your default account:',
      type: 'list',
      choices: web3.eth.accounts,
    },
  ];
  return inquirer.prompt(question);
}

function getDefaultAccount() {
  if (prefs.account) {
    return Promise.resolve({ account: prefs.account });
  }
  return showAccountSelector();
}

function askForAddress(_type) {
  const type = _type === 'feedbase' ? 'feedbase' : 'repeater';
  if (prefs[type]) {
    return Promise.resolve({ address: prefs[type] });
  }
  const questions = [
    {
      name: 'address',
      message: `Enter ${type} address:`,
      type: 'input',
      default: prefs[type] || '',
      validate: str => (
        web3.isAddress(str) || 'Invalid address'
      ),
    },
  ];
  return inquirer.prompt(questions);
}

function runMethod(type, method, args) {
  // status.start();
  utils.getNetwork().then((network) => {
    prefs.network = network;
    return getDefaultAccount();
  })
  .then((answer) => {
    prefs.account = answer.account;
    web3.eth.defaultAccount = answer.account;
    return askForAddress(type);
  })
  .then((answer) => {
    prefs[type] = answer.address;
    const dapple = type === 'feedbase' ? feedbase(answer.address, prefs.network) : repeater(answer.address, prefs.network);
    if (dapple[method]) {
      if (method === 'inspect') {
        // console.log('Getting result... Please wait.');
        // status.stop();
        dump(dapple.inspect(...utils.prepareArgs(args, 'bytes12')));
      } else {
        const setterMethod = method === 'claim' || method === 'set' || method.indexOf('set_') !== -1 || method === 'unset';
        const subMethod = utils.detectMethodArgs(dapple[method], args.length);
        let func = subMethod ? dapple[method][subMethod] : dapple[method];
        func = setterMethod ? func : func.call;
        const preparedArgs = subMethod ? utils.prepareArgs(args, subMethod) : args;
        if (setterMethod) {
          // status.message('Waiting for your approval... Please sign the transaction.');
        } else {
          // console.log('Getting result... Please wait.');
        }
        func(...preparedArgs, (e, r) => {
          if (!e) {
            if (!e) {
              if (setterMethod) {
                // It means we are calling a writing method
                // status.message(`Transaction ${r} generated. Waiting for confirmation...`);
                dapple.filter({}, (err, id) => {
                  // status.stop();
                  if (err) {
                    console.log('Error: ', err.message);
                  } else if (dapple.owner(id) === prefs.account) {
                    dump(dapple.inspect(id.substring(0, 26)));
                  } else {
                    console.warn('Something weird: ', id);
                  }
                  process.exit();
                });
              } else {
                // It means we are calling a read method
                dump(r);
              }
            } else {
              console.warn('Something weird: ', e);
            }
          }
        });
      }
    }
  })
  .catch((error) => {
    // status.stop();
    console.log(error);
    process.exit(1);
  });
}

program
  .version(pkg.version)
  .option('-c, --clear', 'clear user preferences')
  .option('-a, --account [account]', 'set default account')
  .option('-i, --info', 'prints default information')
  .option('--no-color', 'no color on outputs');

program
  .command('feedbase <method> [args...]')
  .alias('feed')
  .alias('f')
  .description('interact with a feedbase contract')
  .on('--help', () => {
    console.log('');
    console.log('    inspect           [id]');
    console.log('    owner             [id]');
    console.log('    label             [id]');
    console.log('    timestamp         [id]');
    console.log('    expiration        [id]');
    console.log('    expired           [id]');
    console.log('    get               [id]');
    console.log('    tryGet            [id]');
    console.log('');
    console.log('    claim');
    console.log('    set               [id, value, expiration]');
    console.log('    set               [id, value] (expiration = unlimited)');
    console.log('    set_owner         [id, ownerAddress]');
    console.log('    set_label         [id, labelText]');
    console.log('');
  })
  .action((method, args) => {
    runMethod('feedbase', method, args);
  });

program
  .command('repeater <method> [args...]')
  .alias('r')
  .description('interact with a feed repeater contract')
  .on('--help', () => {
    console.log('  Methods:');
    console.log('');
    console.log('    inspect           [id]');
    console.log('    owner             [id]');
    console.log('    label             [id]');
    console.log('    minimumValid      [id]');
    console.log('    feedsQuantity     [id]');
    console.log('    get               [id]');
    console.log('    tryGet            [id]');
    console.log('    tryGetFeed        [id, feedPosition]');
    console.log('    getFeedInfo       [id, feedPosition]');
    console.log('');
    console.log('    claim             (minimumValid = 1)');
    console.log('    claim             [minimumValid]');
    console.log('    set               [id, feedbaseAddress, feedId] (adding new feedbase on repeater)');
    console.log('    set               [id, feedPosition, feedbaseAddress, feedId] (editing feedbase on repeater)');
    console.log('    unset             [id, feedPosition]');
    console.log('    set_owner         [id, ownerAddress]');
    console.log('    set_label         [id, labelText]');
    console.log('    set_minimumValid  [id, labelText]');
    console.log('');
  })
  .action((method, args) => {
    runMethod('repeater', method, args);
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ feeds feedbase claim');
  console.log('    $ feeds feedbase set_label 3 "My Label"');
  console.log('    $ feeds repeater claim -a 0x929be46495338d84ec78e6894eeaec136c21ab7b');
  console.log('    $ feeds repeater inspect 1');
  console.log('');
});

program.parse(process.argv); // end with parse to parse through the input

if (program.clear) {
  clearPreferences();
  console.log('Cleared preferences.');
}

if (program.account) {
  if (program.account === true) {
    showAccountSelector().then((answer) => {
      prefs.account = answer.account;
      web3.eth.defaultAccount = answer.account;
    });
  } else if (web3.isAddress(program.account)) {
    prefs.account = program.account;
    web3.eth.defaultAccount = program.account;
    console.log('Default account set');
  } else {
    console.log('Error: invalid account');
  }
}

if (program.info) {
  dump(prefs);
}

// if (!program.args.length) program.help();
