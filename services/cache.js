const mongoose = require('mongoose');
const { capitalize } = require('lodash');
const { DISABLE_CACHE } = process.env;
const {
  client,
} = require('./redis');


const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
  const { key } = options;
  this._useCache = true;
  this.hashKey = JSON.stringify(key || 'defaultKey')
  return this;
}

mongoose.Query.prototype.exec = async function cachedExec() {
  if (!this._useCache) {
    return exec.apply(this, arguments);
  }
  const collectionName = this.mongooseCollection.collectionName;
  const Model = this.model;
  const key = createCacheKey(
    this.getQuery(),
    collectionName,
  );
  // check if query was run before
  const cachedJSON = await client.hget(this.hashKey, key.query);
  if (cachedJSON) {
    console.log(`Getting ${key.collection} docs from cache.`)
    const cached = JSON.parse(cachedJSON);
    return Array.isArray(cached)
      ? cached.map(doc => new Model(doc))
      : new Model(cached);
  }
  // hit Mongo
  const mongoResults = await exec.apply(this, arguments);
  // save query in cache
  client.hset(this.hashKey, key.query, JSON.stringify(mongoResults));
  return mongoResults;
};

function createCacheKey(query, collectionName) {
  const copy = {};
  for (let key in query) {
    if (key === '_id') {
      copy[key] = query._id.toString();
    } else { copy[key] = query[key]}
  }
  return {
    collection: collectionName,
    query: JSON.stringify(copy),
  };
}
