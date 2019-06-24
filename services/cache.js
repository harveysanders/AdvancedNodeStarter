const mongoose = require('mongoose');
const {
  client,
  hgetAsync
} = require('./redis');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  console.log(`i'm about to run a query`);

  const key = createCacheKey(
    this.getQuery(),
    this.mongooseCollection.collectionName
  );
  // check if query was run before
  const cached = await client.hget(key.collection, key.query);
  if (cached) {
    return JSON.parse(cached);
  }
  // hit Mongo
  const mongoResults = await exec.apply(this, arguments);
  // save query in cache
  client.hset(key.collection, key.query, JSON.stringify(mongoResults));
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
