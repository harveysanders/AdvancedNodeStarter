const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = function () {
  console.log(`i'm about to run a query`);
  const query = this.getQuery();
  stringifyId(query);
  console.log(query);
  console.log(this.mongooseCollection.collectionName);
  // check if query was run before
    // if so return cache
    // if not
      // hit Mongo
      // save query in cache
  return exec.apply(this, arguments);
};

function stringifyId (query) {
  return query._id && (query._id = query._id.toString());
}