const redis = require('redis');
const { promisify } = require('util');

const { redisURI } = require('../config/keys');
const client = redis.createClient(redisURI);

client.hset= promisify(client.hset);
client.hget = promisify(client.hget);
client.set= promisify(client.set);
client.get= promisify(client.get);

module.exports = {
  client,
};
