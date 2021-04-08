const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider({ gasLimit: 10000000 }));

const compiledCampaign = require('../ethereum/build/Campaign.json');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

let accounts = [];
let factory = null;
let campaignAddress = null;
let campaign = null;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '10000000' });

  await factory.methods
    .createCampaign('100')
    .send({ from: accounts[0], gas: '1000000' });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe('Campaigns', () => {
  it('Deploys a factory and a campaign.', async () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('Marks caller of createCampaign as the campaign manager.', async () => {
    const manager = await campaign.methods.campaignManager().call();
    assert.strictEqual(accounts[0], manager);
  });

  it('Allows people to contribute money and marks them as approvers.', async () => {
    await campaign.methods.contribute().send({
      value: '200',
      from: accounts[1],
    });
    const isContributor = await campaign.methods
      .campaignContributors(accounts[1])
      .call();
    assert(isContributor);
  });

  it('Requires the minimum contribution to be met for campaign contributers.', async () => {
    try {
      await campaign.methods.contribute().send({
        value: '5',
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(error);
    }
  });

  it('Allows the campaign manager to create a spending request.', async () => {
    await campaign.methods
      .createSpendingRequest('Buy protest gear.', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000',
      });

    const request = await campaign.methods.requests(0).call();
    assert.strictEqual('Buy protest gear.', request.description);
  });

  it('Process requests properly - end to end test.', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether'),
    });

    await campaign.methods
      .createSpendingRequest(
        'Request Decs',
        web3.utils.toWei('5', 'ether'),
        accounts[2]
      )
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods
      .approveSpendingRequest(0)
      .send({ from: accounts[0], gas: '1000000' });

    await campaign.methods.finalizeSpendingRequest(0).send({
      from: accounts[0],
      gas: '1000000',
    });

    let balance = await web3.eth.getBalance(accounts[2]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance === 105);
  });
});
