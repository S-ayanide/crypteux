import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0xD8f6d2E3eCC2F36806466100Cc690B53C5B84C31'
);

export default factoryInstance;
