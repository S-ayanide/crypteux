const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const campaignSource = fs.readFileSync(campaignPath, 'utf-8');

var complierInput = {
  language: 'Solidity',
  sources: {
    'Campaign.sol': {
      content: campaignSource,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

let compiledContracts = JSON.parse(solc.compile(JSON.stringify(complierInput)));
fs.ensureDirSync(buildPath);

for (let contract in compiledContracts['contracts']['Campaign.sol']) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + '.json'),
    compiledContracts['contracts']['Campaign.sol'][contract]
  );
}
