
const KrakenClient = require('kraken-api');
const api = require('./api-key.json');

const kraken = new KrakenClient(api.key, api.secret);

module.exports = { kraken };
