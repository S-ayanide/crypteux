const routes = require('next-routes')();
routes
  .add('/campaign/new', '/campaign/new')
  .add('/campaign/:campaignAddress', '/campaign/show')
  .add('/campaign/request/new/:campaignAddress', '/campaign/request/new');
module.exports = routes;
